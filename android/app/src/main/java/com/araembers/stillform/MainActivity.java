package com.araembers.stillform;

import android.os.Bundle;
import android.content.Intent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatchBridgePlugin.class);
        registerPlugin(WidgetBridgePlugin.class);
        handleWidgetAction(getIntent());
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleWidgetAction(intent);
    }

    private void handleWidgetAction(Intent intent) {
        if (intent != null && intent.hasExtra("stillform_action")) {
            String action = intent.getStringExtra("stillform_action");
            getSharedPreferences("stillform", MODE_PRIVATE)
                .edit()
                .putString("widget_action", action)
                .commit();
        }
    }
}
