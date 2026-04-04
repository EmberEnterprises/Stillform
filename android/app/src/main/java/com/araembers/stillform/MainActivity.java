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
    }

    @Override
    public void onStart() {
        super.onStart();

        if (getIntent() != null && getIntent().hasExtra("stillform_action")) {
            String action = getIntent().getStringExtra("stillform_action");
            String safeAction = action.replace("'", "\\'");

            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "localStorage.setItem('widget_action', '" + safeAction + "'); window.location.reload();",
                    null
                );
            });

            // Clear extras to prevent duplicate triggers
            setIntent(new Intent());
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
}
