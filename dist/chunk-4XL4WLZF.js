import { getSubstrateChain } from './chunk-AOLYRLXE.js';
import { allSubstrateWallets, isWalletInstalled, nightlyConnect, enableWallet, getSubstrateWallet } from './chunk-FD6XJ7QV.js';
import { accountsAreEqual, watchBalance, getBalance, watchPSP22Balances, getPSP22Balances, getDeployment, initPolkadotJs, accountArraysAreEqual } from './chunk-YSQNQUVI.js';
import { getNightlyConnectAdapter } from './chunk-NTTTUCAE.js';
import { __async, __spreadProps, __spreadValues } from './chunk-TZT3FP6S.js';
import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';
import { ContractPromise } from '@polkadot/api-contract';

// src/registry.ts
var registerDeployment = (setDeployments, deployment) => {
  setDeployments((deployments) => {
    const idx = deployments.findIndex(
      ({ contractId, networkId }) => contractId.toLowerCase() === deployment.contractId.toLowerCase() && networkId.toLowerCase() === deployment.networkId.toLowerCase()
    );
    if (idx >= 0)
      deployments.splice(idx, 1);
    return [...deployments, deployment];
  });
};
var registerDeployments = (setDeployments, deployments) => __async(void 0, null, function* () {
  (yield deployments).forEach((deployment) => registerDeployment(setDeployments, deployment));
});
var LS_ACTIVE_ACCOUNT_ADDRESS = "activeAccountAddress";
var LS_ACTIVE_EXTENSION_ID = "activeExtensionId";
var UseInkathonProviderContext = createContext(null);
var useInkathon = () => {
  const context = useContext(UseInkathonProviderContext);
  if (!context)
    throw new Error("useInkathon must be used within a UseInkathonProvider");
  return context;
};
var UseInkathonProvider = ({
  children,
  appName,
  defaultChain,
  connectOnInit,
  deployments: _deployments,
  apiOptions,
  supportedWallets = allSubstrateWallets
}) => {
  if (!defaultChain || typeof defaultChain === "string" && getSubstrateChain(defaultChain) === void 0) {
    throw new Error(
      "None or invalid `defaultChain` provided with `UseInkathonProvider`. Forgot to set environment variable?"
    );
  }
  const isInitializing = useRef(false);
  const isInitialized = useRef(false);
  const [isConnecting, setIsConnecting] = useState(connectOnInit);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState();
  const [activeChain, setActiveChain] = useState(
    typeof defaultChain === "string" ? getSubstrateChain(defaultChain) : defaultChain
  );
  const [api, setApi] = useState();
  const [provider, setProvider] = useState();
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, _setActiveAccount] = useState();
  const [lastActiveAccount, setLastActiveAccount] = useState();
  const activeExtension = useRef();
  const activeSigner = useRef();
  const unsubscribeAccounts = useRef();
  const [deployments, setDeployments] = useState([]);
  useEffect(() => {
    if (_deployments)
      registerDeployments(setDeployments, _deployments);
  }, []);
  const initialize = (chain) => __async(void 0, null, function* () {
    isInitializing.current = true;
    setIsConnected(false);
    setError(void 0);
    const _chain = chain || activeChain;
    let _api;
    let _provider;
    try {
      ;
      ({ api: _api, provider: _provider } = yield initPolkadotJs(_chain, __spreadValues({
        noInitWarn: true,
        throwOnConnect: true
      }, apiOptions)));
      api == null ? void 0 : api.disconnect();
      setApi(_api);
      provider == null ? void 0 : provider.disconnect();
      setProvider(_provider);
      isInitialized.current = true;
      if (activeChain.network !== _chain.network)
        setActiveChain(_chain);
    } catch (e) {
      const message = "Error while initializing Polkadot.js API";
      console.error(message, e);
      setError({ code: 0 /* InitializationError */, message });
      setIsConnected(false);
      setIsConnecting(false);
      setApi(void 0);
      setProvider(void 0);
      isInitialized.current = false;
    }
    isInitializing.current = false;
    return _api;
  });
  const setActiveAccount = (account) => {
    if (typeof account === "function") {
      _setActiveAccount((prevAccount) => {
        const newAccount = account(prevAccount);
        if (newAccount) {
          localStorage.setItem(LS_ACTIVE_ACCOUNT_ADDRESS, newAccount.address);
        } else {
          localStorage.removeItem(LS_ACTIVE_ACCOUNT_ADDRESS);
        }
        return newAccount;
      });
    } else {
      _setActiveAccount(account);
      if (account) {
        localStorage.setItem(LS_ACTIVE_ACCOUNT_ADDRESS, account.address);
      } else {
        localStorage.removeItem(LS_ACTIVE_ACCOUNT_ADDRESS);
      }
    }
  };
  const updateAccounts = (injectedAccounts, lastActiveAccountAddress) => {
    const newAccounts = injectedAccounts || [];
    const _lastAccount = lastActiveAccountAddress ? { address: lastActiveAccountAddress } : lastActiveAccount;
    const newAccount = newAccounts.find((a) => accountsAreEqual(a, _lastAccount)) || (newAccounts == null ? void 0 : newAccounts[0]);
    if (!accountArraysAreEqual(accounts, newAccounts)) {
      setAccounts(() => newAccounts);
    }
    if (!accountsAreEqual(activeAccount, newAccount)) {
      setActiveAccount(() => newAccount);
    }
    setIsConnected(!!newAccount);
  };
  useEffect(() => {
    if (activeAccount && !accountsAreEqual(activeAccount, lastActiveAccount)) {
      setLastActiveAccount(() => activeAccount);
    }
  }, [activeAccount]);
  const connect = (chain, wallet, lastActiveAccountAddress, isInitialConnect) => __async(void 0, null, function* () {
    var _a;
    setError(void 0);
    setIsConnecting(true);
    setIsConnected(!!activeAccount);
    if (!(api == null ? void 0 : api.isConnected) || chain && chain.network !== activeChain.network) {
      const _api = yield initialize(chain);
      if (!(_api == null ? void 0 : _api.isConnected))
        return;
    }
    try {
      const wallets = supportedWallets.filter((w) => {
        if (!isWalletInstalled(w))
          return false;
        if (isInitialConnect && w.id === nightlyConnect.id)
          return false;
        return true;
      });
      if (!(wallets == null ? void 0 : wallets.length)) {
        const message = "No Substrate-compatible extension detected";
        setError({
          code: 1 /* NoSubstrateExtensionDetected */,
          message
        });
        throw new Error(message);
      }
      const preferredWallet = wallet && wallets.find((w) => w.id === wallet.id);
      const _wallet = preferredWallet || wallets[0];
      const extension = yield enableWallet(_wallet, appName);
      activeExtension.current = extension;
      localStorage.setItem(LS_ACTIVE_EXTENSION_ID, _wallet.id);
      activeSigner.current = extension == null ? void 0 : extension.signer;
      (_a = unsubscribeAccounts.current) == null ? void 0 : _a.call(unsubscribeAccounts);
      const unsubscribe = extension == null ? void 0 : extension.accounts.subscribe((accounts2) => {
        updateAccounts(accounts2, lastActiveAccountAddress);
      });
      unsubscribeAccounts.current = unsubscribe;
    } catch (e) {
      console.error("Error while connecting wallet:", e);
      activeExtension.current = void 0;
      activeSigner.current = void 0;
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  });
  useEffect(() => {
    api == null ? void 0 : api.setSigner(activeSigner.current);
  }, [api, activeSigner.current]);
  const disconnect = (disconnectApi) => __async(void 0, null, function* () {
    var _a, _b;
    if (disconnectApi) {
      yield provider == null ? void 0 : provider.disconnect();
      yield api == null ? void 0 : api.disconnect();
      localStorage.removeItem(LS_ACTIVE_EXTENSION_ID);
      localStorage.removeItem(LS_ACTIVE_ACCOUNT_ADDRESS);
      return;
    }
    if (((_a = activeExtension.current) == null ? void 0 : _a.name) === nightlyConnect.id) {
      const adapter = yield getNightlyConnectAdapter(appName);
      yield adapter == null ? void 0 : adapter.disconnect();
    }
    setIsConnected(false);
    updateAccounts([]);
    (_b = unsubscribeAccounts.current) == null ? void 0 : _b.call(unsubscribeAccounts);
    unsubscribeAccounts.current = void 0;
    activeExtension.current = void 0;
    activeSigner.current = void 0;
    isInitialized.current = false;
  });
  useEffect(() => {
    if (!api)
      return;
    const handler = () => {
      disconnect();
    };
    api == null ? void 0 : api.on("disconnected", handler);
    return () => {
      api == null ? void 0 : api.off("disconnected", handler);
    };
  }, [api]);
  useEffect(() => {
    if (isInitialized.current || isInitializing.current)
      return;
    const activeExtensionId = localStorage.getItem(LS_ACTIVE_EXTENSION_ID) || void 0;
    const activeAccountAddress = localStorage.getItem(LS_ACTIVE_ACCOUNT_ADDRESS) || void 0;
    const userWantsConnection = activeExtensionId && activeAccountAddress;
    let activeExtension2;
    if (activeExtensionId) {
      activeExtension2 = allSubstrateWallets.find((w) => w.id === activeExtensionId);
    }
    connectOnInit || userWantsConnection ? connect(void 0, activeExtension2, activeAccountAddress, true) : initialize();
    return () => {
      var _a;
      (_a = unsubscribeAccounts.current) == null ? void 0 : _a.call(unsubscribeAccounts);
    };
  }, []);
  const switchActiveChain = (chain) => __async(void 0, null, function* () {
    const activeWallet = activeExtension.current && getSubstrateWallet(activeExtension.current.name);
    yield connect(chain, activeWallet);
  });
  return /* @__PURE__ */ jsx(
    UseInkathonProviderContext.Provider,
    {
      value: {
        isInitializing: isInitializing.current,
        isInitialized: isInitialized.current,
        isConnecting,
        isConnected,
        error,
        activeChain,
        switchActiveChain,
        api,
        provider,
        connect,
        disconnect,
        accounts,
        activeAccount,
        activeExtension: activeExtension.current,
        activeSigner: activeSigner.current,
        setActiveAccount,
        lastActiveAccount,
        deployments,
        supportedWallets
      },
      children
    }
  );
};
var useBalance = (address, watch, formatterOptions) => {
  const { api } = useInkathon();
  const [balanceData, setBalanceData] = useState({
    tokenSymbol: "Unit",
    tokenDecimals: 12
  });
  const [unsubscribes, setUnsubscribes] = useState([]);
  useEffect(() => {
    const updateBalanceData = (data) => {
      setBalanceData(() => data);
    };
    if (!api) {
      updateBalanceData({});
      return;
    }
    if (watch) {
      watchBalance(api, address, updateBalanceData, formatterOptions).then((unsubscribe) => {
        setUnsubscribes((prev) => [...prev, unsubscribe]);
      });
    } else {
      getBalance(api, address, formatterOptions).then(updateBalanceData);
    }
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe == null ? void 0 : unsubscribe());
      setUnsubscribes(() => []);
    };
  }, [api, address]);
  return balanceData;
};
var useContract = (abi, address) => {
  const { api, isConnecting } = useInkathon();
  const [contract, setContract] = useState();
  const initialize = () => __async(void 0, null, function* () {
    if (isConnecting || !api || !abi || !address) {
      setContract(void 0);
      return;
    }
    try {
      const contract2 = new ContractPromise(api, abi, address);
      setContract(contract2);
    } catch (error) {
      console.error("Error during Contract initialization", error);
    }
  });
  useEffect(() => {
    initialize();
  }, [api, isConnecting, abi, address]);
  return {
    contract,
    address
  };
};
var usePSP22Balances = (address, watch, formatterOptions) => {
  const { api, activeChain } = useInkathon();
  const [balanceData, setBalanceData] = useState(
    []
  );
  const [unsubscribes, setUnsubscribes] = useState([]);
  useEffect(() => {
    const updateBalanceData = (data) => {
      setBalanceData(() => data);
    };
    if (!api || !activeChain) {
      setBalanceData([]);
      return;
    }
    if (watch) {
      const unsubscribe = watchPSP22Balances(
        api,
        address,
        updateBalanceData,
        activeChain.network,
        formatterOptions
      );
      unsubscribe && setUnsubscribes((prev) => [...prev, unsubscribe]);
    } else {
      getPSP22Balances(api, address, activeChain.network, formatterOptions).then(updateBalanceData);
    }
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe == null ? void 0 : unsubscribe());
      setUnsubscribes(() => []);
    };
  }, [api, address, activeChain]);
  return balanceData;
};

// src/hooks/useRegisteredContract.ts
var useRegisteredContract = (contractId, networkId) => {
  const { deployments, activeChain } = useInkathon();
  networkId = networkId || (activeChain == null ? void 0 : activeChain.network) || "";
  const deployment = getDeployment(deployments || [], contractId, networkId);
  return useContract(deployment == null ? void 0 : deployment.abi, deployment == null ? void 0 : deployment.address);
};
var useRegisteredTypedContract = (contractId, Contract, networkId) => {
  const { api, activeAccount } = useInkathon();
  const registeredContract = useRegisteredContract(contractId, networkId);
  const [typedContract, setTypedContract] = useState(void 0);
  useEffect(() => {
    if (!(registeredContract == null ? void 0 : registeredContract.address) || !(activeAccount == null ? void 0 : activeAccount.address) || !api) {
      setTypedContract(void 0);
      return;
    }
    const typedContract2 = new Contract(
      registeredContract.address.toString(),
      activeAccount.address,
      api
    );
    setTypedContract(typedContract2);
  }, [registeredContract == null ? void 0 : registeredContract.address, activeAccount == null ? void 0 : activeAccount.address]);
  return __spreadProps(__spreadValues({}, registeredContract), { typedContract });
};

export { LS_ACTIVE_ACCOUNT_ADDRESS, LS_ACTIVE_EXTENSION_ID, UseInkathonProvider, registerDeployment, registerDeployments, useBalance, useContract, useInkathon, usePSP22Balances, useRegisteredContract, useRegisteredTypedContract };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-4XL4WLZF.js.map