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
      iconColor: "#C8922A"
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
