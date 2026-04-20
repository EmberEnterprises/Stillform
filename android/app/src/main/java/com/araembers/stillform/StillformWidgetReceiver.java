package com.araembers.stillform;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class StillformWidgetReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if ("com.araembers.stillform.WIDGET_BREATHE".equals(intent.getAction())) {
            // Set flag BEFORE launching — so it exists when the app reads it
            SharedPreferences prefs = context.getSharedPreferences("stillform_widget", Context.MODE_PRIVATE);
            prefs.edit().putBoolean("launch_breathe", true).commit(); // commit(), not apply() — synchronous

            // Launch the app
            Intent launchIntent = new Intent();
            launchIntent.setClassName(context, "com.araembers.stillform.MainActivity");
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(launchIntent);
        }
    }
}
