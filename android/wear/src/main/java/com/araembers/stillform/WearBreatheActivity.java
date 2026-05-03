package com.araembers.stillform;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.WindowManager;
import android.widget.TextView;

public class WearBreatheActivity extends Activity {

    private Vibrator vibrator;
    private Handler handler;
    private TextView phaseLabel;
    private TextView countLabel;
    private TextView cycleLabel;

    // Default: Regulate (4-4-8-2) pattern
    private int[] phaseDurations = {4, 4, 8, 2};
    private String[] phaseNames = {"Inhale", "Hold", "Exhale", "Rest"};
    private int currentPhase = 0;
    private int currentCount = 0;
    private int currentCycle = 1;
    private int totalCycles = 3;
    private boolean running = false;

    // Haptic patterns for each phase
    // Inhale: gentle ascending pulses
    // Hold: steady light buzz
    // Exhale: slow descending pulses
    // Rest: silence

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_wear_breathe);

        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        handler = new Handler(Looper.getMainLooper());

        phaseLabel = findViewById(R.id.phase_label);
        countLabel = findViewById(R.id.count_label);
        cycleLabel = findViewById(R.id.cycle_label);

        // Check for pattern from phone via intent extras.
        // Pattern IDs and durations must match BREATHING_PATTERNS in src/App.jsx.
        // Phone-side default is "quick" (see watchBridge.startBreathing default arg in App.jsx).
        String pattern = getIntent().getStringExtra("pattern");
        if (pattern != null) {
            switch (pattern) {
                case "quick":
                    // Quick Reset: 4 inhale, 4 hold, 6 exhale (no rest).
                    phaseDurations = new int[]{4, 4, 6, 0};
                    phaseNames = new String[]{"Inhale", "Hold", "Exhale", ""};
                    break;
                case "deep":
                    // Deep Regulate: 4 inhale, 4 hold, 8 exhale, 2 rest.
                    // Matches the default declared at top of class.
                    phaseDurations = new int[]{4, 4, 8, 2};
                    phaseNames = new String[]{"Inhale", "Hold", "Exhale", "Rest"};
                    break;
                case "cyclic_sigh":
                    // Cyclic Sighing (Balban et al. 2023, Cell Reports Medicine 4:100895):
                    // primary nasal inhale (4), secondary top-off inhale (1), long oral exhale (8).
                    // The "Hold" slot is repurposed as the second inhale; label updated accordingly.
                    phaseDurations = new int[]{4, 1, 8, 0};
                    phaseNames = new String[]{"Inhale", "Inhale", "Exhale", ""};
                    break;
            }
        }

        startBreathing();
    }

    private void startBreathing() {
        running = true;
        currentPhase = 0;
        currentCount = phaseDurations[0];
        currentCycle = 1;
        updateDisplay();
        hapticPhaseStart();
        tick();
    }

    private void tick() {
        if (!running) return;

        handler.postDelayed(() -> {
            currentCount--;

            if (currentCount <= 0) {
                // Move to next phase
                currentPhase++;

                // Skip phases with 0 duration
                while (currentPhase < phaseDurations.length && phaseDurations[currentPhase] == 0) {
                    currentPhase++;
                }

                if (currentPhase >= phaseDurations.length) {
                    // Cycle complete
                    currentCycle++;
                    if (currentCycle > totalCycles) {
                        // Session complete
                        hapticComplete();
                        phaseLabel.setText("◎");
                        countLabel.setText("");
                        cycleLabel.setText("Composed");
                        running = false;

                        // Auto-close after 3 seconds
                        handler.postDelayed(() -> finish(), 3000);
                        return;
                    }
                    currentPhase = 0;
                }

                currentCount = phaseDurations[currentPhase];
                hapticPhaseStart();
            } else {
                // Mid-phase tick
                hapticTick();
            }

            updateDisplay();
            tick();
        }, 1000);
    }

    private void updateDisplay() {
        String phase = currentPhase < phaseNames.length ? phaseNames[currentPhase] : "";
        phaseLabel.setText(phase);
        countLabel.setText(String.valueOf(currentCount));
        cycleLabel.setText(currentCycle + " / " + totalCycles);
    }

    private void hapticPhaseStart() {
        if (vibrator == null) return;
        try {
            switch (currentPhase) {
                case 0: // Inhale — medium pulse
                    vibrator.vibrate(VibrationEffect.createOneShot(60, 120));
                    break;
                case 1: // Hold — light pulse
                    vibrator.vibrate(VibrationEffect.createOneShot(30, 60));
                    break;
                case 2: // Exhale — gentle long pulse
                    vibrator.vibrate(VibrationEffect.createOneShot(80, 80));
                    break;
                case 3: // Rest — very light
                    vibrator.vibrate(VibrationEffect.createOneShot(15, 40));
                    break;
            }
        } catch (Exception e) { /* fallback: no haptics */ }
    }

    private void hapticTick() {
        if (vibrator == null) return;
        try {
            vibrator.vibrate(VibrationEffect.createOneShot(8, 40));
        } catch (Exception e) { /* silent */ }
    }

    private void hapticComplete() {
        if (vibrator == null) return;
        try {
            // Success pattern: two strong pulses
            long[] pattern = {0, 60, 80, 100};
            int[] amplitudes = {0, 180, 0, 220};
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, amplitudes, -1));
        } catch (Exception e) { /* silent */ }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        running = false;
        handler.removeCallbacksAndMessages(null);
    }
}
