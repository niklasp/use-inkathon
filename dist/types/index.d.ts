import { S as SubstrateDeployment } from '../SubstrateDeployment-sg-O6SXE.js';
export { D as DeployedContract } from '../SubstrateDeployment-sg-O6SXE.js';
import { S as SubstrateChain } from '../SubstrateChain-lWDT_tLg.js';
export { a as SubstrateExplorer } from '../SubstrateChain-lWDT_tLg.js';
import { S as SubstrateWallet } from '../SubstrateWallet--wd9VjIx.js';
export { a as SubstrateWalletPlatform } from '../SubstrateWallet--wd9VjIx.js';
export { T as TypechainContractConstructor } from '../TypechainContractConstructor-vRYAvqDn.js';
import { ApiPromise, WsProvider, HttpProvider } from '@polkadot/api';
import { InjectedAccount, InjectedExtension } from '@polkadot/extension-inject/types';
import { Signer } from '@polkadot/types/types';
import { Dispatch, SetStateAction } from 'react';
import '@polkadot/types/interfaces';
import '@polkadot/api-contract';
import '@polkadot/keyring/types';

interface ChainAsset {
    originChain: string;
    slug: string;
    name: string;
    symbol: string;
    decimals: number;
    assetType: AssetType;
    metadata: Record<any, any> | null;
    iconPath: string;
}
declare enum AssetType {
    PSP22 = "PSP22",
    PSP34 = "PSP34"
}

type UseInkathonProviderContextType = {
    isInitializing?: boolean;
    isInitialized?: boolean;
    isConnecting?: boolean;
    isConnected?: boolean;
    error?: UseInkathonError;
    activeChain?: SubstrateChain;
    switchActiveChain?: (chain: SubstrateChain) => Promise<void>;
    api?: ApiPromise;
    provider?: WsProvider | HttpProvider;
    connect?: (chain?: SubstrateChain, wallet?: SubstrateWallet, lastActiveAccountAddress?: string) => Promise<void>;
    disconnect?: () => void;
    accounts?: InjectedAccount[];
    activeAccount?: InjectedAccount;
    activeExtension?: InjectedExtension;
    activeSigner?: Signer;
    setActiveAccount?: Dispatch<SetStateAction<InjectedAccount | undefined>>;
    lastActiveAccount?: InjectedAccount;
    deployments?: SubstrateDeployment[];
    supportedWallets?: SubstrateWallet[];
};
interface UseInkathonError {
    code: UseInkathonErrorCode;
    message: string;
}
declare enum UseInkathonErrorCode {
    InitializationError = 0,
    NoSubstrateExtensionDetected = 1,
    NoAccountInjected = 2
}

export { AssetType, type ChainAsset, SubstrateChain, SubstrateDeployment, SubstrateWallet, type UseInkathonError, UseInkathonErrorCode, type UseInkathonProviderContextType };
