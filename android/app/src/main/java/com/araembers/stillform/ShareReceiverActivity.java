package com.araembers.stillform;

import android.content.Intent;
import android.os.Bundle;

public class ShareReceiverActivity extends com.getcapacitor.BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null && "text/plain".equals(type)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null) {
                // Redirect to the main app with the shared text as a query parameter
                String encodedText = android.net.Uri.encode(sharedText);
                Intent mainIntent = new Intent(Intent.ACTION_VIEW);
                mainIntent.setData(android.net.Uri.parse("https://stillformapp.com/?share=" + encodedText));
                mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(mainIntent);
                finish();
            }
        }
    }
}
