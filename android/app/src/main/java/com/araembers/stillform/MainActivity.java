package com.araembers.stillform;

import android.os.Bundle;
import android.content.Intent;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private String widgetAction = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatchBridgePlugin.class);
        registerPlugin(WidgetBridgePlugin.class);

        // Read intent BEFORE super.onCreate loads WebView
        if (getIntent() != null) {
            widgetAction = getIntent().getStringExtra("stillform_action");
            Log.d("StillformWidget", "onCreate intent extra: " + widgetAction);
        }

        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        // Inject after bridge is fully initialized
        Log.d("StillformWidget", "onStart injecting interface with action: " + widgetAction);
        getBridge().getWebView().addJavascriptInterface(
            new WidgetDataInterface(widgetAction), "StillformWidget"
        );
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        String action = intent != null ? intent.getStringExtra("stillform_action") : null;
        Log.d("StillformWidget", "onNewIntent action: " + action);
        if ("breathe".equals(action)) {
            widgetAction = action;
            getBridge().getWebView().addJavascriptInterface(
                new WidgetDataInterface(action), "StillformWidget"
            );
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "window.location.reload();", null
                );
            });
        }
    }
}
