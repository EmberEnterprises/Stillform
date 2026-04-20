package com.araembers.stillform;

import android.Manifest;
import android.content.ContentResolver;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.CalendarContract;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.core.content.ContextCompat;
import androidx.health.connect.client.HealthConnectClient;
import androidx.health.connect.client.permission.HealthPermission;
import androidx.health.connect.client.records.HeartRateVariabilitySdnnRecord;
import androidx.health.connect.client.records.RestingHeartRateRecord;
import androidx.health.connect.client.records.SleepSessionRecord;
import androidx.health.connect.client.request.ReadRecordsRequest;
import androidx.health.connect.client.time.TimeRangeFilter;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.json.JSONArray;
import org.json.JSONObject;

@CapacitorPlugin(name = "IntegrationBridge")
public class IntegrationBridgePlugin extends Plugin {

    private static final String TAG = "IntegrationBridge";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    // ─── HEALTH ───────────────────────────────────────────────────────────────

    @PluginMethod
    public void syncHealth(PluginCall call) {
        // Check if Health Connect is available on this device
        int status = HealthConnectClient.getSdkStatus(getContext());
        if (status != HealthConnectClient.SDK_AVAILABLE) {
            JSObject result = new JSObject();
            result.put("ok", false);
            result.put("supported", false);
            result.put("status", "unavailable");
            result.put("error", "Health Connect is not available on this device.");
            call.resolve(result);
            return;
        }

        executor.execute(() -> {
            try {
                HealthConnectClient client = HealthConnectClient.getOrCreate(getContext());

                // Check permissions
                Set<String> granted = new HashSet<>();
                try {
                    granted = client.getGrantedPermissions();
                } catch (Exception e) {
                    Log.w(TAG, "Could not get granted permissions: " + e.getMessage());
                }

                boolean hasSleep = granted.contains(HealthPermission.getReadPermission(SleepSessionRecord.class));
                boolean hasHrv = granted.contains(HealthPermission.getReadPermission(HeartRateVariabilitySdnnRecord.class));
                boolean hasHr = granted.contains(HealthPermission.getReadPermission(RestingHeartRateRecord.class));

                if (!hasSleep && !hasHrv && !hasHr) {
                    // Request permissions — surfaces Health Connect permission dialog
                    JSObject result = new JSObject();
                    result.put("ok", false);
                    result.put("supported", true);
                    result.put("status", "permission_required");
                    result.put("error", "Health Connect permission required. Please grant access in Settings.");
                    call.resolve(result);
                    return;
                }

                Instant now = Instant.now();
                Instant yesterday = now.minus(24, ChronoUnit.HOURS);
                TimeRangeFilter last24h = TimeRangeFilter.between(yesterday, now);

                Double sleepHours = null;
                Double hrv = null;
                Double restingHr = null;

                // Sleep
                if (hasSleep) {
                    try {
                        ReadRecordsRequest<SleepSessionRecord> sleepReq =
                            new ReadRecordsRequest.Builder<>(SleepSessionRecord.class, last24h).build();
                        List<SleepSessionRecord> sleepRecords = client.readRecords(sleepReq).getRecords();
                        if (!sleepRecords.isEmpty()) {
                            long totalMs = 0;
                            for (SleepSessionRecord r : sleepRecords) {
                                totalMs += r.getEndTime().toEpochMilli() - r.getStartTime().toEpochMilli();
                            }
                            sleepHours = totalMs / 3600000.0;
                        }
                    } catch (Exception e) {
                        Log.w(TAG, "Sleep read failed: " + e.getMessage());
                    }
                }

                // HRV
                if (hasHrv) {
                    try {
                        ReadRecordsRequest<HeartRateVariabilitySdnnRecord> hrvReq =
                            new ReadRecordsRequest.Builder<>(HeartRateVariabilitySdnnRecord.class, last24h).build();
                        List<HeartRateVariabilitySdnnRecord> hrvRecords = client.readRecords(hrvReq).getRecords();
                        if (!hrvRecords.isEmpty()) {
                            double sum = 0;
                            for (HeartRateVariabilitySdnnRecord r : hrvRecords) {
                                sum += r.getHeartRateVariabilityMillis();
                            }
                            hrv = sum / hrvRecords.size();
                        }
                    } catch (Exception e) {
                        Log.w(TAG, "HRV read failed: " + e.getMessage());
                    }
                }

                // Resting heart rate
                if (hasHr) {
                    try {
                        ReadRecordsRequest<RestingHeartRateRecord> hrReq =
                            new ReadRecordsRequest.Builder<>(RestingHeartRateRecord.class, last24h).build();
                        List<RestingHeartRateRecord> hrRecords = client.readRecords(hrReq).getRecords();
                        if (!hrRecords.isEmpty()) {
                            double sum = 0;
                            for (RestingHeartRateRecord r : hrRecords) {
                                sum += r.getBeatsPerMinute();
                            }
                            restingHr = sum / hrRecords.size();
                        }
                    } catch (Exception e) {
                        Log.w(TAG, "Resting HR read failed: " + e.getMessage());
                    }
                }

                JSObject result = new JSObject();
                result.put("ok", true);
                result.put("supported", true);
                result.put("status", "connected");
                if (sleepHours != null) result.put("sleepHours", Math.round(sleepHours * 10.0) / 10.0);
                if (hrv != null) result.put("hrv", Math.round(hrv * 10.0) / 10.0);
                if (restingHr != null) result.put("restingHr", Math.round(restingHr));
                result.put("updatedAt", now.toString());
                call.resolve(result);

            } catch (Exception e) {
                Log.e(TAG, "syncHealth error: " + e.getMessage(), e);
                JSObject result = new JSObject();
                result.put("ok", false);
                result.put("supported", true);
                result.put("status", "error");
                result.put("error", e.getMessage());
                call.resolve(result);
            }
        });
    }

    // ─── CALENDAR ─────────────────────────────────────────────────────────────

    @PluginMethod
    public void syncCalendar(PluginCall call) {
        // Check READ_CALENDAR permission
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_CALENDAR)
                != PackageManager.PERMISSION_GRANTED) {
            JSObject result = new JSObject();
            result.put("ok", false);
            result.put("supported", true);
            result.put("status", "permission_required");
            result.put("error", "Calendar permission required.");
            call.resolve(result);
            return;
        }

        executor.execute(() -> {
            try {
                long now = System.currentTimeMillis();
                long in48h = now + (48L * 60 * 60 * 1000);

                ContentResolver cr = getContext().getContentResolver();
                Uri uri = CalendarContract.Events.CONTENT_URI;

                String[] projection = {
                    CalendarContract.Events.TITLE,
                    CalendarContract.Events.DTSTART,
                    CalendarContract.Events.DTEND,
                    CalendarContract.Events.ALL_DAY
                };

                String selection = CalendarContract.Events.DTSTART + " >= ? AND "
                    + CalendarContract.Events.DTSTART + " <= ? AND "
                    + CalendarContract.Events.DELETED + " = 0";

                String[] selArgs = { String.valueOf(now), String.valueOf(in48h) };

                Cursor cursor = cr.query(uri, projection, selection, selArgs,
                    CalendarContract.Events.DTSTART + " ASC");

                JSONArray events = new JSONArray();
                String firstTitle = null;

                if (cursor != null) {
                    while (cursor.moveToNext() && events.length() < 8) {
                        String title = cursor.getString(0);
                        long start = cursor.getLong(1);
                        long end = cursor.getLong(2);
                        int allDay = cursor.getInt(3);

                        if (title == null || title.trim().isEmpty()) continue;
                        if (allDay == 1) continue; // skip all-day events

                        JSONObject event = new JSONObject();
                        event.put("title", title.trim());
                        event.put("start", Instant.ofEpochMilli(start).toString());
                        event.put("end", Instant.ofEpochMilli(end).toString());
                        events.put(event);

                        if (firstTitle == null) firstTitle = title.trim();
                    }
                    cursor.close();
                }

                String summary = firstTitle != null
                    ? (events.length() > 1 ? events.length() + " events today, starting with: " + firstTitle : firstTitle)
                    : "";

                JSObject result = new JSObject();
                result.put("ok", true);
                result.put("supported", true);
                result.put("status", "connected");
                result.put("summary", summary);
                result.put("events", events.toString());
                result.put("updatedAt", Instant.now().toString());
                call.resolve(result);

            } catch (Exception e) {
                Log.e(TAG, "syncCalendar error: " + e.getMessage(), e);
                JSObject result = new JSObject();
                result.put("ok", false);
                result.put("supported", true);
                result.put("status", "error");
                result.put("error", e.getMessage());
                call.resolve(result);
            }
        });
    }
}
