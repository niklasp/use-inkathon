import { __async } from './chunk-TZT3FP6S.js';
import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';

// src/helpers/getWebsiteIcon.ts
var getWebsiteIcon = (origin) => __async(void 0, null, function* () {
  try {
    const text = yield (yield fetch(origin)).text();
    const appleTouchIconRegex = /<link\s.*?rel="apple-touch-icon".*?href="(.*?)".*?>/i;
    const faviconRegex = /<link\s.*?rel=(?:"icon"|"shortcut icon").*?href="(.*?)".*?>/i;
    const appleTouchIconMatch = text.match(appleTouchIconRegex);
    const faviconMatch = text.match(faviconRegex);
    if (appleTouchIconMatch == null ? void 0 : appleTouchIconMatch[1]) {
      const iconUrl = new URL(appleTouchIconMatch[1], origin).href;
      return iconUrl;
    } else if (faviconMatch == null ? void 0 : faviconMatch[1]) {
      const iconUrl = new URL(faviconMatch[1], origin).href;
      return iconUrl;
    }
    const faviconExist = yield fetch(origin + "/favicon.ico");
    if (faviconExist.status === 200) {
      return origin + "/favicon.ico";
    }
    return void 0;
  } catch (e) {
    return void 0;
  }
});
var _adapter;
var getNightlyConnectAdapter = (appName, appIcon, appOrigin, persisted = true) => __async(void 0, null, function* () {
  if (_adapter)
    return _adapter;
  try {
    const name = appName || (window == null ? void 0 : window.location.hostname);
    const icon = appIcon || (yield getWebsiteIcon(window == null ? void 0 : window.origin));
    const description = appOrigin || (window == null ? void 0 : window.origin);
    _adapter = yield NightlyConnectAdapter.build(
      {
        appMetadata: { name, icon, description },
        network: "AlephZero"
      },
      persisted
    );
  } catch (e) {
    return void 0;
  }
  return _adapter;
});

export { getNightlyConnectAdapter, getWebsiteIcon };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-NTTTUCAE.js.map