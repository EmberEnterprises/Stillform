import Foundation
import Capacitor
import EventKit
import HealthKit

@objc(IntegrationBridgePlugin)
public class IntegrationBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "IntegrationBridgePlugin"
    public let jsName = "IntegrationBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "syncCalendar", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "syncHealth", returnType: CAPPluginReturnPromise)
    ]

    private let healthStore = HKHealthStore()
    private let isoFormatter = ISO8601DateFormatter()
    private let timeFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter
    }()

    public override init() {
        super.init()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    }

    @objc func syncCalendar(_ call: CAPPluginCall) {
        let store = EKEventStore()
        requestCalendarAccess(store: store) { [weak self] granted, status, errorMessage in
            guard let self else { return }
            if granted == false {
                var payload: [String: Any] = [
                    "ok": false,
                    "status": status
                ]
                if let errorMessage, !errorMessage.isEmpty {
                    payload["error"] = errorMessage
                }
                call.resolve(payload)
                return
            }

            let now = Date()
            let windowEnd = Calendar.current.date(byAdding: .hour, value: 24, to: now) ?? now
            let predicate = store.predicateForEvents(withStart: now, end: windowEnd, calendars: nil)
            let events = store.events(matching: predicate).sorted { $0.startDate < $1.startDate }

            let serializedEvents = events.prefix(8).map { event in
                [
                    "title": event.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "Untitled event" : event.title,
                    "start": self.isoString(event.startDate),
                    "end": self.isoString(event.endDate)
                ]
            }

            let summary: String = {
                guard let first = events.first else { return "" }
                let title = first.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "Untitled event" : first.title
                let time = self.timeFormatter.string(from: first.startDate)
                if events.count == 1 {
                    return "Next: \(title) at \(time)"
                }
                return "Next: \(title) at \(time) · \(events.count) events in next 24h"
            }()

            call.resolve([
                "ok": true,
                "status": events.isEmpty ? "no-data" : "connected",
                "summary": summary,
                "events": serializedEvents,
                "updatedAt": self.isoString(Date())
            ])
        }
    }

    @objc func syncHealth(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve([
                "ok": false,
                "status": "unsupported",
                "error": "Health data is not available on this device."
            ])
            return
        }

        let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)
        let restingType = HKObjectType.quantityType(forIdentifier: .restingHeartRate)
        let hrvType = HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN)
        let readTypes = Set([sleepType, restingType, hrvType].compactMap { $0 })
        guard !readTypes.isEmpty else {
            call.resolve([
                "ok": false,
                "status": "unsupported",
                "error": "No HealthKit metrics are available for this build."
            ])
            return
        }

        healthStore.requestAuthorization(toShare: nil, read: readTypes) { [weak self] _, error in
            guard let self else { return }
            if let error {
                call.resolve([
                    "ok": false,
                    "status": "error",
                    "error": "Health authorization failed: \(error.localizedDescription)"
                ])
                return
            }

            let deniedCount = readTypes.filter { self.healthStore.authorizationStatus(for: $0) == .sharingDenied }.count
            if deniedCount == readTypes.count {
                call.resolve([
                    "ok": false,
                    "status": "denied",
                    "error": "Health access denied in iOS settings."
                ])
                return
            }

            let group = DispatchGroup()
            var sleepHours: Double?
            var restingHr: Double?
            var hrv: Double?

            group.enter()
            self.fetchSleepHoursLast24h { value in
                sleepHours = value
                group.leave()
            }

            group.enter()
            self.fetchLatestQuantity(identifier: .restingHeartRate, unit: HKUnit(from: "count/min")) { value in
                restingHr = value
                group.leave()
            }

            group.enter()
            self.fetchLatestQuantity(identifier: .heartRateVariabilitySDNN, unit: HKUnit.secondUnit(with: .milli)) { value in
                hrv = value
                group.leave()
            }

            group.notify(queue: .main) {
                let readiness = self.computeReadiness(sleepHours: sleepHours, hrv: hrv, restingHr: restingHr)
                let summaryParts = [
                    sleepHours != nil ? "\(self.roundToSingleDecimal(sleepHours!))h sleep" : nil,
                    hrv != nil ? "HRV \(Int(round(hrv!)))" : nil,
                    restingHr != nil ? "resting HR \(Int(round(restingHr!)))" : nil,
                    readiness != nil ? "readiness \(readiness!)" : nil
                ].compactMap { $0 }
                let summary = summaryParts.joined(separator: ", ")

                var payload: [String: Any] = [
                    "ok": true,
                    "status": summaryParts.isEmpty ? "no-data" : "connected",
                    "summary": summary,
                    "updatedAt": self.isoString(Date())
                ]
                if let sleepHours { payload["sleepHours"] = self.roundToSingleDecimal(sleepHours) }
                if let hrv { payload["hrv"] = Int(round(hrv)) }
                if let restingHr { payload["restingHr"] = Int(round(restingHr)) }
                if let readiness { payload["readiness"] = readiness }
                call.resolve(payload)
            }
        }
    }

    private func requestCalendarAccess(store: EKEventStore, completion: @escaping (Bool, String, String?) -> Void) {
        if #available(iOS 17.0, *) {
            let status = EKEventStore.authorizationStatus(for: .event)
            switch status {
            case .fullAccess, .writeOnly:
                completion(true, "granted", nil)
            case .denied:
                completion(false, "denied", "Calendar access denied in iOS settings.")
            case .restricted:
                completion(false, "restricted", "Calendar access is restricted on this device.")
            case .notDetermined:
                store.requestFullAccessToEvents { granted, error in
                    DispatchQueue.main.async {
                        if let error {
                            completion(false, "error", "Calendar authorization failed: \(error.localizedDescription)")
                            return
                        }
                        completion(granted, granted ? "granted" : "denied", granted ? nil : "Calendar access denied in iOS settings.")
                    }
                }
            @unknown default:
                completion(false, "error", "Calendar authorization state is unknown.")
            }
            return
        }

        let status = EKEventStore.authorizationStatus(for: .event)
        switch status {
        case .authorized:
            completion(true, "granted", nil)
        case .denied:
            completion(false, "denied", "Calendar access denied in iOS settings.")
        case .restricted:
            completion(false, "restricted", "Calendar access is restricted on this device.")
        case .notDetermined:
            store.requestAccess(to: .event) { granted, error in
                DispatchQueue.main.async {
                    if let error {
                        completion(false, "error", "Calendar authorization failed: \(error.localizedDescription)")
                        return
                    }
                    completion(granted, granted ? "granted" : "denied", granted ? nil : "Calendar access denied in iOS settings.")
                }
            }
        @unknown default:
            completion(false, "error", "Calendar authorization state is unknown.")
        }
    }

    private func fetchLatestQuantity(identifier: HKQuantityTypeIdentifier, unit: HKUnit, completion: @escaping (Double?) -> Void) {
        guard let quantityType = HKObjectType.quantityType(forIdentifier: identifier) else {
            completion(nil)
            return
        }
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        let query = HKSampleQuery(sampleType: quantityType, predicate: nil, limit: 1, sortDescriptors: [sort]) { _, samples, _ in
            guard let sample = samples?.first as? HKQuantitySample else {
                completion(nil)
                return
            }
            completion(sample.quantity.doubleValue(for: unit))
        }
        healthStore.execute(query)
    }

    private func fetchSleepHoursLast24h(completion: @escaping (Double?) -> Void) {
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            completion(nil)
            return
        }
        let end = Date()
        let start = Calendar.current.date(byAdding: .hour, value: -24, to: end) ?? end
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictStartDate)
        let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
            guard let samples = samples as? [HKCategorySample], !samples.isEmpty else {
                completion(nil)
                return
            }
            let totalSeconds = samples.reduce(0.0) { partial, sample in
                let isAwake = sample.value == HKCategoryValueSleepAnalysis.awake.rawValue
                let isInBed = sample.value == HKCategoryValueSleepAnalysis.inBed.rawValue
                guard !isAwake, !isInBed else { return partial }
                return partial + sample.endDate.timeIntervalSince(sample.startDate)
            }
            guard totalSeconds > 0 else {
                completion(nil)
                return
            }
            completion(totalSeconds / 3600.0)
        }
        healthStore.execute(query)
    }

    private func computeReadiness(sleepHours: Double?, hrv: Double?, restingHr: Double?) -> String? {
        guard sleepHours != nil || hrv != nil || restingHr != nil else { return nil }

        if let sleepHours, sleepHours < 6 {
            return "low"
        }
        if let hrv, hrv < 25 {
            return "low"
        }
        if let restingHr, restingHr > 85 {
            return "low"
        }
        if let sleepHours, let hrv, let restingHr, sleepHours >= 7, hrv >= 45, restingHr <= 65 {
            return "high"
        }
        return "steady"
    }

    private func roundToSingleDecimal(_ value: Double) -> Double {
        return (value * 10).rounded() / 10
    }

    private func isoString(_ date: Date) -> String {
        return isoFormatter.string(from: date)
    }
}
