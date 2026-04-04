package com.araembers.stillform;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

public class StillformWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            // Create intent that opens the app with a deep link to start breathing
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse("https://stillformapp.com/?action=breathe"));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_stillform);
            views.setOnClickPendingIntent(R.id.widget_icon, pendingIntent);
            views.setOnClickPendingIntent(R.id.widget_label, pendingIntent);
            views.setOnClickPendingIntent(R.id.widget_sublabel, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
