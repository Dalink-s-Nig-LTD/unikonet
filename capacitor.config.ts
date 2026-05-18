import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a212695b68f14b13b6ba20b4a3ca42bc',
  appName: 'uni-connect-hub-12',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://a212695b-68f1-4b13-b6ba-20b4a3ca42bc.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
};

export default config;