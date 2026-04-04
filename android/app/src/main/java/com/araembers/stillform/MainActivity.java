package com.araembers.stillform;

import android.os.Bundle;
import android.content.SharedPreferences;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatchBridgePlugin.class);
        registerPlugin(WidgetBridgePlugin.class);

        // Check widget flag BEFORE super.onCreate loads the WebView
        SharedPreferences prefs = getSharedPreferences("stillform_widget", MODE_PRIVATE);
        boolean widgetBreathe = prefs.getBoolean("launch_breathe", false);
        if (widgetBreathe) {
            prefs.edit().putBoolean("launch_breathe", false).commit();
            // Override the server URL to include the action parameter
            getIntent().putExtra("STILLFORM_WIDGET", true);
        }

        super.onCreate(savedInstanceState);

        // After WebView is ready, inject the flag into localStorage
        if (widgetBreathe) {
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "localStorage.setItem('stillform_widget_breathe','true');window.location.reload();",
                    null
                );
            });
        }
    }
}
