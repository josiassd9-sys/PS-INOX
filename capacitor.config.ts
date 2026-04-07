import type { CapacitorConfig } from '@capacitor/cli';

const webDir = process.env.CAP_WEB_DIR?.trim() || 'public';
const serverUrl = process.env.CAP_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: 'com.psinox.android',
  appName: 'PS INOX',
  webDir,
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: serverUrl.startsWith('http://'),
        },
      }
    : {}),
};

export default config;
