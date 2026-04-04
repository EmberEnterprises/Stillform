package com.araembers.stillform;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class StillformWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            Intent intent = new Intent(context, StillformWidgetReceiver.class);
            intent.setAction("com.araembers.stillform.WIDGET_BREATHE");

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_stillform);
            views.setOnClickPendingIntent(R.id.widget_icon, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
