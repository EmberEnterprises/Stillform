import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.araembers.stillform',
  appName: 'Stillform',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#C8922A",
      sound: "beep.wav"
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
