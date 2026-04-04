package com.araembers.stillform;

import android.content.Intent;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

public class WearListenerService extends WearableListenerService {

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        if (messageEvent.getPath().equals("/stillform/breathe")) {
            String pattern = new String(messageEvent.getData());
            Intent intent = new Intent(this, WearBreatheActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("pattern", pattern);
            startActivity(intent);
        }
    }
}
