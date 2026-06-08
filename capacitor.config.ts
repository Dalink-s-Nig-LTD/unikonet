import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unikonet.app',
  appName: 'Unikonet',
  webDir: 'dist',
  bundledWebRuntime: false,
  // Note: For native production builds, Capacitor loads files locally from webDir ('dist').
  // Uncomment/configure the server block below only for local live-reload development:
  /*
  server: {
    url: "https://a212695b-68f1-4b13-b6ba-20b4a3ca42bc.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  */
};

export default config;