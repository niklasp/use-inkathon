import { getNightlyConnectAdapter } from './chunk-NTTTUCAE.js';
import { __async, __spreadValues, __spreadProps } from './chunk-TZT3FP6S.js';

// src/wallets.ts
var polkadotjs = {
  id: "polkadot-js",
  name: "Polkadot{.js}",
  platforms: ["browser" /* Browser */],
  urls: {
    website: "https://polkadot.js.org/extension/",
    chromeExtension: "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
    firefoxExtension: "https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/"
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/polkadot@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/polkadot@512w.png"
  ]
};
var subwallet = {
  id: "subwallet-js",
  name: "SubWallet",
  platforms: ["browser" /* Browser */],
  urls: {
    website: "https://subwallet.app/",
    chromeExtension: "https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn",
    firefoxExtension: "https://addons.mozilla.org/en-US/firefox/addon/subwallet/"
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/subwallet@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/subwallet@512w.png"
  ]
};
var talisman = {
  id: "talisman",
  name: "Talisman",
  platforms: ["browser" /* Browser */],
  urls: {
    website: "https://www.talisman.xyz/",
    chromeExtension: "https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
    firefoxExtension: "https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/"
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/talisman@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/talisman@512w.png"
  ]
};
var nova = {
  id: "nova",
  name: "Nova Wallet",
  platforms: ["android" /* Android */, "ios" /* iOS */],
  urls: {
    website: "https://novawallet.io/",
    androidApp: "https://play.google.com/store/apps/details?id=io.novafoundation.nova.market",
    iosApp: "https://apps.apple.com/app/nova-polkadot-kusama-wallet/id1597119355"
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nova@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nova@512w.png"
  ]
};
var alephzeroSigner = {
  id: "aleph-zero-signer",
  name: "Aleph Zero Signer",
  platforms: ["browser" /* Browser */],
  urls: {
    website: "https://alephzero.org/signer",
    chromeExtension: "https://chrome.google.com/webstore/detail/opbinaebpmphpefcimknblieddamhmol",
    firefoxExtension: "https://addons.mozilla.org/en-US/firefox/addon/aleph-zero-signer/"
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/aleph-zero-signer@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/aleph-zero-signer@512w.png"
  ]
};
var nightly = {
  id: "Nightly",
  name: "Nightly Wallet",
  platforms: ["browser" /* Browser */],
  urls: {
    website: "https://wallet.nightly.app",
    chromeExtension: "https://chrome.google.com/webstore/detail/nightly/fiikommddbeccaoicoejoniammnalkfa?hl=en",
    firefoxExtension: "https://addons.mozilla.org/en-GB/firefox/addon/nightly-app/"
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightly@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightly@512w.png"
  ]
};
var nightlyConnect = {
  id: "NightlyConnect",
  name: "Nightly Connect",
  platforms: [
    "browser" /* Browser */,
    "android" /* Android */,
    "ios" /* iOS */
  ],
  urls: {
    website: "https://connect.nightly.app/docs/"
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightlyConnect@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightlyConnect@512w.png"
  ]
};
var allSubstrateWallets = [
  subwallet,
  talisman,
  polkadotjs,
  nova,
  alephzeroSigner,
  nightly,
  nightlyConnect
];
var getSubstrateWallet = (id) => {
  return allSubstrateWallets.find((wallet) => wallet.id === id);
};
var isWalletInstalled = (wallet) => {
  var _a, _b;
  try {
    if (typeof window === "undefined")
      return void 0;
    const injectedWindow = window;
    const injectedExtension = (_a = injectedWindow == null ? void 0 : injectedWindow.injectedWeb3) == null ? void 0 : _a[wallet.id];
    const novaIsInstalled = !!((_b = injectedWindow.walletExtension) == null ? void 0 : _b.isNovaWallet);
    if (novaIsInstalled && wallet.id === polkadotjs.id)
      return false;
    if (novaIsInstalled && wallet.id === nova.id)
      return true;
    if (wallet.id === nightlyConnect.id)
      return true;
    return !!injectedExtension;
  } catch (e) {
    return void 0;
  }
};
var enableWallet = (wallet, appName) => __async(void 0, null, function* () {
  var _a;
  if (!isWalletInstalled(wallet))
    return void 0;
  try {
    if (typeof window === "undefined")
      return void 0;
    const injectedWindow = window;
    if (wallet.id === nightlyConnect.id) {
      let adapter;
      try {
        adapter = yield getNightlyConnectAdapter(appName);
        yield adapter.connect();
        const injectedExtension2 = {
          accounts: __spreadProps(__spreadValues({}, adapter.accounts), {
            // A special case that probably results from the way packages are bundled
            subscribe: (cb) => {
              const unsub = adapter.accounts.subscribe(cb);
              adapter.accounts._triggerSubs();
              return unsub;
            }
          }),
          signer: adapter.signer,
          name: wallet.id,
          version: "0.1.10"
        };
        return injectedExtension2;
      } catch (e) {
        yield adapter == null ? void 0 : adapter.disconnect().catch(() => {
        });
        throw new Error("Error while enabling NightlyConnect");
      }
    }
    const injectedWindowProvider = (_a = injectedWindow == null ? void 0 : injectedWindow.injectedWeb3) == null ? void 0 : _a[wallet.id === nova.id ? polkadotjs.id : wallet.id];
    if (!(injectedWindowProvider == null ? void 0 : injectedWindowProvider.enable))
      throw new Error("No according `InjectedWindowProvider` found.");
    const injected = yield injectedWindowProvider.enable(appName);
    const injectedExtension = __spreadProps(__spreadValues({}, injected), {
      name: wallet.id,
      version: injectedWindowProvider.version || ""
    });
    return injectedExtension;
  } catch (e) {
    console.error("Error while enabling wallet", e);
    return void 0;
  }
});

export { alephzeroSigner, allSubstrateWallets, enableWallet, getSubstrateWallet, isWalletInstalled, nightly, nightlyConnect, nova, polkadotjs, subwallet, talisman };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-FD6XJ7QV.js.map