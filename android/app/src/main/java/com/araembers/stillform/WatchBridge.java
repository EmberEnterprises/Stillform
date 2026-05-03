package com.araembers.stillform;

import android.content.Context;
import android.util.Log;

import com.google.android.gms.tasks.Tasks;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WatchBridge {

    private static final String TAG = "StillformWatch";
    private static final ExecutorService executor = Executors.newSingleThreadExecutor();

    /**
     * Send a breathing pattern to the connected watch.
     * Call this when a breathing session starts on the phone.
     *
     * @param context App context
     * @param pattern One of: "quick", "deep", "cyclic_sigh".
     *                Must match a pattern id in BREATHING_PATTERNS (src/App.jsx)
     *                and a switch case in WearBreatheActivity.onCreate.
     */
    public static void startBreathingOnWatch(Context context, String pattern) {
        executor.execute(() -> {
            try {
                List<Node> nodes = Tasks.await(Wearable.getNodeClient(context).getConnectedNodes());
                for (Node node : nodes) {
                    Wearable.getMessageClient(context)
                        .sendMessage(node.getId(), "/stillform/breathe", pattern.getBytes())
                        .addOnSuccessListener(i -> Log.d(TAG, "Breathing sent to watch: " + pattern))
                        .addOnFailureListener(e -> Log.w(TAG, "Watch not reachable: " + e.getMessage()));
                }
            } catch (Exception e) {
                Log.w(TAG, "No watch connected: " + e.getMessage());
            }
        });
    }
}
