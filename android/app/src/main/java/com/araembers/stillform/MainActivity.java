package com.araembers.stillform;

import android.os.Bundle;
import android.content.Intent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatchBridgePlugin.class);
        registerPlugin(WidgetBridgePlugin.class);
        super.onCreate(savedInstanceState);

        // Check if launched from widget
        handleWidgetIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleWidgetIntent(intent);
    }

    private void handleWidgetIntent(Intent intent) {
        if (intent != null && "breathe".equals(intent.getStringExtra("stillform_action"))) {
            // Set localStorage flag that React reads synchronously on mount
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "try { localStorage.setItem('stillform_widget_breathe', 'true'); } catch(e) {}", null
                );
            });
        }
    }
}
