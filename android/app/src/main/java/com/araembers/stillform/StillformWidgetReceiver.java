package com.araembers.stillform;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class StillformWidgetReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if ("com.araembers.stillform.WIDGET_BREATHE".equals(intent.getAction())) {
            // Set flag that the app reads on launch
            SharedPreferences prefs = context.getSharedPreferences("stillform_widget", Context.MODE_PRIVATE);
            prefs.edit().putBoolean("launch_breathe", true).apply();

            // Launch the app
            Intent launchIntent = new Intent(context, MainActivity.class);
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(launchIntent);
        }
    }
}
