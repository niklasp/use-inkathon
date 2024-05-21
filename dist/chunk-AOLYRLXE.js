// src/chains.ts
var development = {
  network: "development",
  name: "Local Development",
  ss58Prefix: 42,
  rpcUrls: ["ws://127.0.0.1:9944"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "ws://127.0.0.1:9944"
    )}/#/explorer`
  },
  testnet: true,
  faucetUrls: ["https://polkadot.js.org/apps/#/accounts?rpc=ws://127.0.0.1:9944"]
};
var alephzeroTestnet = {
  network: "alephzero-testnet",
  name: "Aleph Zero Testnet",
  ss58Prefix: 42,
  rpcUrls: ["wss://ws.test.azero.dev"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://test.azero.dev/?rpc=${encodeURIComponent(
      "wss://ws.test.azero.dev"
    )}/#/explorer`
  },
  testnet: true,
  faucetUrls: ["https://faucet.test.azero.dev"]
};
var popNetworkTestnet = {
  network: "pop-network-testnet",
  name: "Pop Network",
  ss58Prefix: 42,
  rpcUrls: [
    "wss://rpc1.paseo.popnetwork.xyz",
    "wss://rpc2.paseo.popnetwork.xyz",
    "wss://rpc3.paseo.popnetwork.xyz"
  ],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc1.paseo.popnetwork.xyz`
  },
  testnet: true,
  faucetUrls: ["https://faucet.polkadot.io/"]
};
var contracts = {
  network: "contracts",
  name: "Contracts on Rococo",
  ss58Prefix: 42,
  rpcUrls: ["wss://rococo-contracts-rpc.polkadot.io"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=wss%253A%252F%252Frococo-contracts-rpc.polkadot.io`
  },
  testnet: true,
  faucetUrls: ["https://matrix.to/#/#rococo-faucet:matrix.org"]
};
var rococo = contracts;
var shibuya = {
  network: "shibuya",
  name: "Shibuya Testnet",
  ss58Prefix: 5,
  rpcUrls: ["wss://shibuya-rpc.dwellir.com"],
  explorerUrls: {
    ["subscan" /* Subscan */]: `https://shibuya.subscan.io`
  },
  testnet: true,
  faucetUrls: ["https://portal.astar.network/#/shibuya-testnet/assets"]
};
var t0rnTestnet = {
  network: "t0rn-testnet",
  name: "t0rn Testnet",
  ss58Prefix: 42,
  rpcUrls: ["wss://ws.t0rn.io"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://ws.t0rn.io"
    )}/#/explorer`
  },
  testnet: true,
  faucetUrls: ["https://faucet.t0rn.io"]
};
var bitCountryAlphaTestnet = {
  network: "bitcountry-alpha-testnet",
  name: "Bit.Country Alpha Testnet",
  ss58Prefix: 268,
  rpcUrls: ["wss://alphanet-rpc-gcp.bit.country"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://alphanet-rpc-gcp.bit.country"
    )}#/explorer`
  },
  testnet: true,
  faucetUrls: ["https://testnet.bit.country/p/wallet/balance"]
};
var agungTestnet = {
  network: "agung-testnet",
  name: "Agung Testnet",
  ss58Prefix: 42,
  rpcUrls: ["wss://wss.agung.peaq.network"],
  explorerUrls: {
    ["subscan" /* Subscan */]: `https://agung-testnet.subscan.io/`,
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://wss.agung.peaq.network"
    )}/#/explorer`
  },
  testnet: true,
  faucetUrls: ["https://discord.com/channels/943486047625572392/963415793394143232"]
};
var amplitudeTestnet = {
  network: "amplitude-testnet",
  name: "Amplitude Testnet",
  ss58Prefix: 57,
  rpcUrls: ["wss://pencol-roc-00.pendulumchain.tech"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://pencol-roc-00.pendulumchain.tech"
    )}/#/explorer`
  },
  testnet: true,
  faucetUrls: []
};
var phalaPOC6Testnet = {
  network: "phala-PoC-6-testnet",
  name: "Phala PoC-6 Testnet",
  ss58Prefix: 30,
  rpcUrls: ["wss://poc6.phala.network/ws"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://poc6.phala.network/ws"
    )}#/explorer`
  },
  testnet: true,
  faucetUrls: ["https://phala.network/faucet"]
};
var ternoaAlphanet = {
  network: "ternoa-alphanet",
  name: "Ternoa Alphanet",
  ss58Prefix: 42,
  rpcUrls: ["wss://alphanet.ternoa.com"],
  testnet: true,
  faucetUrls: ["https://faucet.ternoa.network"],
  explorerUrls: {
    ["other" /* Other */]: `https://explorer-alphanet.ternoa.dev`
  }
};
var shiden = {
  network: "shiden",
  name: "Shiden",
  ss58Prefix: 5,
  rpcUrls: ["wss://shiden-rpc.dwellir.com"],
  explorerUrls: {
    ["subscan" /* Subscan */]: `https://shiden.subscan.io`
  }
};
var amplitude = {
  network: "amplitude",
  name: "Amplitude",
  ss58Prefix: 57,
  rpcUrls: ["wss://rpc-amplitude.pendulumchain.tech", "wss://amplitude-rpc.dwellir.com"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://rpc-amplitude.pendulumchain.tech"
    )}#/explorer`
  }
};
var khala = {
  network: "khala",
  name: "Khala",
  ss58Prefix: 30,
  rpcUrls: [
    "wss://khala-api.phala.network/ws",
    "wss://khala.api.onfinality.io/public-ws",
    "wss://khala-rpc.dwellir.com",
    "wss://public-rpc.pinknode.io/khala"
  ],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://khala-api.phala.network/ws"
    )}#/explorer`,
    ["subscan" /* Subscan */]: `https://khala.subscan.io`
  }
};
var alephzero = {
  network: "alephzero",
  name: "Aleph Zero",
  ss58Prefix: 42,
  rpcUrls: ["wss://ws.azero.dev"],
  explorerUrls: {
    ["subscan" /* Subscan */]: `https://alephzero.subscan.io`,
    ["polkadotjs" /* PolkadotJs */]: `https://azero.dev/?rpc=${encodeURIComponent(
      "wss://ws.azero.dev"
    )}/#/explorer`
  }
};
var astar = {
  network: "astar",
  name: "Astar",
  ss58Prefix: 5,
  rpcUrls: ["wss://astar-rpc.dwellir.com"],
  explorerUrls: {
    ["subscan" /* Subscan */]: `https://astar.subscan.io`
  }
};
var pendulum = {
  network: "pendulum",
  name: "Pendulum",
  ss58Prefix: 56,
  rpcUrls: ["wss://rpc-pendulum.prd.pendulumchain.tech", "wss://pendulum-rpc.dwellir.com"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://rpc-pendulum.prd.pendulumchain.tech"
    )}#/explorer`
  }
};
var phala = {
  network: "phala",
  name: "Phala",
  ss58Prefix: 30,
  rpcUrls: ["wss://api.phala.network/ws", "wss://phala.api.onfinality.io/public-ws"],
  explorerUrls: {
    ["polkadotjs" /* PolkadotJs */]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(
      "wss://api.phala.network/ws"
    )}#/explorer`,
    ["subscan" /* Subscan */]: `https://phala.subscan.io`
  }
};
var ternoa = {
  network: "ternoa",
  name: "Ternoa",
  ss58Prefix: 42,
  rpcUrls: ["wss://mainnet.ternoa.com"],
  explorerUrls: {
    ["other" /* Other */]: `https://explorer.ternoa.com`
  }
};
var allSubstrateChains = [
  agungTestnet,
  alephzero,
  alephzeroTestnet,
  amplitude,
  amplitudeTestnet,
  astar,
  bitCountryAlphaTestnet,
  development,
  khala,
  pendulum,
  phala,
  phalaPOC6Testnet,
  rococo,
  shibuya,
  shiden,
  t0rnTestnet,
  ternoa,
  ternoaAlphanet,
  popNetworkTestnet
];
var getSubstrateChain = (networkId) => {
  return allSubstrateChains.find(
    (chain) => chain.network.toLowerCase() === (networkId || "").toLowerCase()
  );
};

export { agungTestnet, alephzero, alephzeroTestnet, allSubstrateChains, amplitude, amplitudeTestnet, astar, bitCountryAlphaTestnet, contracts, development, getSubstrateChain, khala, pendulum, phala, phalaPOC6Testnet, popNetworkTestnet, rococo, shibuya, shiden, t0rnTestnet, ternoa, ternoaAlphanet };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-AOLYRLXE.js.map