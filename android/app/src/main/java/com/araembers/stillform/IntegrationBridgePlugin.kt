package com.araembers.stillform

import android.Manifest
import android.content.pm.PackageManager
import android.provider.CalendarContract
import android.util.Log
import androidx.core.content.ContextCompat
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.runBlocking
import org.json.JSONArray
import org.json.JSONObject
import java.time.Instant
import java.time.temporal.ChronoUnit

@CapacitorPlugin(name = "IntegrationBridge")
class IntegrationBridgePlugin : Plugin() {

    companion object {
        private const val TAG = "IntegrationBridge"
    }

    @PluginMethod
    fun syncHealth(call: PluginCall) {
        val status = HealthConnectClient.getSdkStatus(context)
        if (status != HealthConnectClient.SDK_AVAILABLE) {
            call.resolve(JSObject().apply {
                put("ok", false)
                put("supported", false)
                put("status", "unavailable")
                put("error", "Health Connect is not available on this device.")
            })
            return
        }

        Thread {
            try {
                val client = HealthConnectClient.getOrCreate(context)
                val now = Instant.now()
                val yesterday = now.minus(24, ChronoUnit.HOURS)
                val timeRange = TimeRangeFilter.between(yesterday, now)

                var sleepHours: Double? = null
                var hrv: Double? = null
                var restingHr: Double? = null
                var permissionRequired = false

                try {
                    val records = runBlocking {
                        client.readRecords(ReadRecordsRequest(SleepSessionRecord::class, timeRange)).records
                    }
                    if (records.isNotEmpty()) {
                        val totalMs = records.sumOf { it.endTime.toEpochMilli() - it.startTime.toEpochMilli() }
                        sleepHours = totalMs / 3_600_000.0
                    }
                } catch (e: SecurityException) {
                    Log.w(TAG, "Sleep permission not granted")
                    permissionRequired = true
                } catch (e: Exception) {
                    Log.w(TAG, "Sleep read failed: ${e.message}")
                }

                try {
                    val records = runBlocking {
                        client.readRecords(ReadRecordsRequest(HeartRateVariabilityRmssdRecord::class, timeRange)).records
                    }
                    if (records.isNotEmpty()) {
                        hrv = records.map { it.heartRateVariabilityMillis }.average()
                    }
                } catch (e: SecurityException) {
                    Log.w(TAG, "HRV permission not granted")
                    permissionRequired = true
                } catch (e: Exception) {
                    Log.w(TAG, "HRV read failed: ${e.message}")
                }

                try {
                    val records = runBlocking {
                        client.readRecords(ReadRecordsRequest(RestingHeartRateRecord::class, timeRange)).records
                    }
                    if (records.isNotEmpty()) {
                        restingHr = records.map { it.beatsPerMinute.toDouble() }.average()
                    }
                } catch (e: SecurityException) {
                    Log.w(TAG, "HR permission not granted")
                    permissionRequired = true
                } catch (e: Exception) {
                    Log.w(TAG, "HR read failed: ${e.message}")
                }

                if (permissionRequired && sleepHours == null && hrv == null && restingHr == null) {
                    call.resolve(JSObject().apply {
                        put("ok", false)
                        put("supported", true)
                        put("status", "permission_required")
                        put("error", "Health Connect permission required. Please grant access in Settings.")
                    })
                    return@Thread
                }

                call.resolve(JSObject().apply {
                    put("ok", true)
                    put("supported", true)
                    put("status", "connected")
                    sleepHours?.let { put("sleepHours", Math.round(it * 10.0) / 10.0) }
                    hrv?.let { put("hrv", Math.round(it * 10.0) / 10.0) }
                    restingHr?.let { put("restingHr", Math.round(it)) }
                    put("updatedAt", now.toString())
                })

            } catch (e: Exception) {
                Log.e(TAG, "syncHealth error: ${e.message}", e)
                call.resolve(JSObject().apply {
                    put("ok", false)
                    put("supported", true)
                    put("status", "error")
                    put("error", e.message)
                })
            }
        }.start()
    }

    @PluginMethod
    fun syncCalendar(call: PluginCall) {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CALENDAR)
            != PackageManager.PERMISSION_GRANTED) {
            call.resolve(JSObject().apply {
                put("ok", false)
                put("supported", true)
                put("status", "permission_required")
                put("error", "Calendar permission required.")
            })
            return
        }

        Thread {
            try {
                val now = System.currentTimeMillis()
                val in48h = now + (48L * 60 * 60 * 1000)
                val cr = context.contentResolver
                val uri = CalendarContract.Events.CONTENT_URI
                val projection = arrayOf(
                    CalendarContract.Events.TITLE,
                    CalendarContract.Events.DTSTART,
                    CalendarContract.Events.DTEND,
                    CalendarContract.Events.ALL_DAY
                )
                val selection = "${CalendarContract.Events.DTSTART} >= ? AND " +
                    "${CalendarContract.Events.DTSTART} <= ? AND " +
                    "${CalendarContract.Events.DELETED} = 0"
                val cursor = cr.query(uri, projection, selection,
                    arrayOf(now.toString(), in48h.toString()),
                    "${CalendarContract.Events.DTSTART} ASC")

                val events = JSONArray()
                var firstTitle: String? = null

                cursor?.use {
                    while (it.moveToNext() && events.length() < 8) {
                        val title = it.getString(0)?.trim()
                        if (title.isNullOrEmpty()) continue
                        val start = it.getLong(1)
                        val end = it.getLong(2)
                        if (it.getInt(3) == 1) continue
                        events.put(JSONObject().apply {
                            put("title", title)
                            put("start", Instant.ofEpochMilli(start).toString())
                            put("end", Instant.ofEpochMilli(end).toString())
                        })
                        if (firstTitle == null) firstTitle = title
                    }
                }

                val summary = when {
                    firstTitle == null -> ""
                    events.length() > 1 -> "${events.length()} events, starting with: $firstTitle"
                    else -> firstTitle!!
                }

                call.resolve(JSObject().apply {
                    put("ok", true)
                    put("supported", true)
                    put("status", "connected")
                    put("summary", summary)
                    put("events", events.toString())
                    put("updatedAt", Instant.now().toString())
                })

            } catch (e: Exception) {
                Log.e(TAG, "syncCalendar error: ${e.message}", e)
                call.resolve(JSObject().apply {
                    put("ok", false)
                    put("supported", true)
                    put("status", "error")
                    put("error", e.message)
                })
            }
        }.start()
    }
}
