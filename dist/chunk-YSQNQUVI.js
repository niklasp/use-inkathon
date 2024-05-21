import { __spreadProps, __spreadValues, __async } from './chunk-TZT3FP6S.js';
import { formatBalance as formatBalance$1, BN, bnToBn, stringCamelCase } from '@polkadot/util';
import { CodePromise, ContractPromise } from '@polkadot/api-contract';
import { HttpProvider, WsProvider, ApiPromise } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// src/helpers/accountsAreEqual.ts
var accountsAreEqual = (a1, a2) => {
  return ((a1 == null ? void 0 : a1.address) || "").toLowerCase() === ((a2 == null ? void 0 : a2.address) || "").toLowerCase();
};
var accountArraysAreEqual = (a1, a2) => {
  if (a1.length !== a2.length)
    return false;
  return a1.every((a, i) => accountsAreEqual(a, a2[i]));
};
var formatBalance = (api, value, options, tokenData) => {
  var _a, _b, _c, _d;
  if (!value)
    return "";
  const tokenDecimals = ((_b = (_a = api == null ? void 0 : api.registry) == null ? void 0 : _a.chainDecimals) == null ? void 0 : _b[0]) || (tokenData == null ? void 0 : tokenData.tokenDecimals) || 12;
  const tokenSymbol = ((_d = (_c = api == null ? void 0 : api.registry) == null ? void 0 : _c.chainTokens) == null ? void 0 : _d[0]) || (tokenData == null ? void 0 : tokenData.tokenSymbol) || "Unit";
  const _options = Object.assign(
    {
      decimals: tokenDecimals,
      withUnit: true,
      forceUnit: "-"
    },
    options
  );
  let formattedBalance = formatBalance$1(value, __spreadProps(__spreadValues({}, _options), {
    withUnit: false,
    withZero: false
  }));
  if (_options.fixedDecimals !== void 0) {
    let siUnit;
    if (_options.forceUnit !== "-") {
      siUnit = formattedBalance.split(" ")[1];
      formattedBalance = formattedBalance.split(" ")[0];
    }
    formattedBalance = toFixed(
      formattedBalance,
      _options.fixedDecimals,
      _options.removeTrailingZeros
    );
    if (siUnit)
      formattedBalance = `${formattedBalance} ${siUnit}`;
  }
  if (_options.forceUnit !== "-") {
    const siUnit = formattedBalance.split(" ")[1];
    formattedBalance = formattedBalance.split(" ")[0];
    if (siUnit)
      formattedBalance = `${formattedBalance}\u200A${siUnit}`;
  }
  if (_options.withUnit === true) {
    formattedBalance = `${formattedBalance} ${tokenSymbol}`;
  }
  return formattedBalance;
};
var toFixed = (value, decimals, removeTrailingZeros) => {
  const _value = typeof value === "string" ? value : `${value}`;
  let valueDecimals = _value.split(".")[1] || "0";
  valueDecimals = parseFloat(`0.${valueDecimals}`).toFixed(decimals);
  if (removeTrailingZeros) {
    valueDecimals = `${+valueDecimals}`;
  }
  const formattedValue = valueDecimals.split(".")[1] ? `${_value.split(".")[0]}.${valueDecimals.split(".")[1]}` : _value.split(".")[0];
  return formattedValue;
};

// src/helpers/getBalance.ts
var getBalance = (api, address, formatterOptions) => __async(void 0, null, function* () {
  if (!address) {
    const { tokenDecimals, tokenSymbol } = parseBalanceData(api);
    return {
      tokenDecimals,
      tokenSymbol
    };
  }
  const result = yield api.query.system.account(address);
  const balanceData = parseBalanceData(api, result == null ? void 0 : result.data, formatterOptions);
  return balanceData;
});
var watchBalance = (api, address, callback, formatterOptions) => __async(void 0, null, function* () {
  const { tokenDecimals, tokenSymbol } = parseBalanceData(api);
  if (!address) {
    callback({
      tokenDecimals,
      tokenSymbol
    });
    return null;
  }
  const unsubscribe = yield api.query.system.account(address, ({ data }) => {
    const balanceData = parseBalanceData(api, data, formatterOptions);
    callback(balanceData);
  });
  return unsubscribe;
});
var parseBalanceData = (api, data, formatterOptions) => {
  var _a, _b;
  const tokenDecimals = ((_a = api.registry.chainDecimals) == null ? void 0 : _a[0]) || 12;
  const tokenSymbol = ((_b = api.registry.chainTokens) == null ? void 0 : _b[0]) || "Unit";
  const freeBalance = new BN((data == null ? void 0 : data.free) || 0);
  const reservedBalance = new BN((data == null ? void 0 : data.reserved) || 0);
  const balance = reservedBalance.add(freeBalance);
  const miscFrozenBalance = new BN((data == null ? void 0 : data.miscFrozen) || 0);
  const feeFrozenBalance = new BN((data == null ? void 0 : data.feeFrozen) || 0);
  const reducibleBalance = freeBalance.sub(
    miscFrozenBalance.gt(feeFrozenBalance) ? miscFrozenBalance : feeFrozenBalance
  );
  const freeBalanceFormatted = formatBalance(api, freeBalance, formatterOptions);
  const reservedBalanceFormatted = formatBalance(api, reservedBalance, formatterOptions);
  const reducibleBalanceFormatted = formatBalance(api, reducibleBalance, formatterOptions);
  const balanceFormatted = formatBalance(api, balance, formatterOptions);
  return {
    tokenDecimals,
    tokenSymbol,
    freeBalance,
    freeBalanceFormatted,
    reservedBalance,
    reservedBalanceFormatted,
    reducibleBalance,
    reducibleBalanceFormatted,
    balance,
    balanceFormatted
  };
};

// src/helpers/checkIfBalanceSufficient.ts
var checkIfBalanceSufficient = (api, account, minBalance) => __async(void 0, null, function* () {
  try {
    const accountAddress = typeof account === "string" ? account : account.address;
    const { reducibleBalance } = yield getBalance(api, accountAddress);
    const hasZeroBalance = !reducibleBalance || reducibleBalance.isZero();
    const hasBalanceBelowMin = minBalance && reducibleBalance && reducibleBalance.lte(bnToBn(minBalance));
    return !hasZeroBalance && !hasBalanceBelowMin;
  } catch (e) {
    console.error("Error while checking for minimum balance:", e);
  }
  return false;
});
var getAbiMessage = (contract, method) => {
  const abiMessage = contract.abi.messages.find(
    (m) => stringCamelCase(m.method) === stringCamelCase(method)
  );
  if (!abiMessage) {
    throw new Error(`"${method}" not found in Contract`);
  }
  return abiMessage;
};

// src/helpers/decodeOutput.ts
function isErr(o) {
  return typeof o === "object" && o !== null && "Err" in o;
}
function isOk(o) {
  return typeof o === "object" && o !== null && "Ok" in o;
}
function getReturnTypeName(type) {
  return (type == null ? void 0 : type.lookupName) || (type == null ? void 0 : type.type) || "";
}
function decodeOutput({ result }, contract, method) {
  var _a, _b, _c, _d;
  let output;
  let decodedOutput = "";
  let isError = true;
  if (result.isOk) {
    const flags = result.asOk.flags.toHuman();
    isError = flags.includes("Revert");
    const abiMessage = getAbiMessage(contract, method);
    const returnType = abiMessage.returnType;
    const returnTypeName = getReturnTypeName(returnType);
    const registry = contract.abi.registry;
    const r = returnType ? registry.createTypeUnsafe(returnTypeName, [result.asOk.data]).toHuman() : "()";
    output = isOk(r) ? r.Ok : isErr(r) ? r.Err : r;
    const errorText = isErr(output) ? typeof output.Err === "object" ? JSON.stringify(output.Err, null, 2) : (_b = (_a = output.Err) == null ? void 0 : _a.toString()) != null ? _b : "Error" : output !== "Ok" ? (output == null ? void 0 : output.toString()) || "Error" : "Error";
    const okText = isOk(r) ? typeof output === "object" ? JSON.stringify(output, null, "	") : (_c = output == null ? void 0 : output.toString()) != null ? _c : "()" : (_d = JSON.stringify(output, null, "	")) != null ? _d : "()";
    decodedOutput = isError ? errorText : okText;
  } else if (result.isErr) {
    output = result.toHuman();
    let errorText;
    if (isErr(output) && typeof output.Err === "object" && Object.keys(output.Err || {}).length && typeof Object.values(output.Err || {})[0] === "string") {
      const [errorKey, errorValue] = Object.entries(output.Err || {})[0];
      errorText = `${errorKey}${errorValue}`;
    }
    decodedOutput = errorText || "Error";
  }
  return {
    output,
    decodedOutput,
    isError
  };
}

// src/helpers/getExtrinsicErrorMessage.ts
var getExtrinsicErrorMessage = (errorEvent) => {
  var _a, _b, _c;
  let errorMessage = "Error";
  if ((_a = errorEvent == null ? void 0 : errorEvent.message) == null ? void 0 : _a.match(
    /(user reject request|cancelled|rejected by user|user rejected approval)/i
  )) {
    errorMessage = "UserCancelled";
  }
  const errorText = (_b = errorEvent == null ? void 0 : errorEvent.toString) == null ? void 0 : _b.call(errorEvent);
  const rpcErrorCode = errorText && typeof errorText === "string" ? (_c = errorText.match(/RpcError: (\d+):/i)) == null ? void 0 : _c[1] : null;
  switch (rpcErrorCode) {
    case "1010":
      errorMessage = "TokenBelowMinimum";
      break;
  }
  return errorMessage;
};
var getGasLimit = (api, _refTime, _proofSize) => {
  const refTime = bnToBn(_refTime);
  const proofSize = bnToBn(_proofSize);
  return api.registry.createType("WeightV2", {
    refTime,
    proofSize
  });
};
var getMaxGasLimit = (api, reductionFactor = 0.8) => {
  var _a, _b;
  const blockWeights = api.consts.system.blockWeights.toPrimitive();
  const maxExtrinsic = (_b = (_a = blockWeights == null ? void 0 : blockWeights.perClass) == null ? void 0 : _a.normal) == null ? void 0 : _b.maxExtrinsic;
  const maxRefTime = (maxExtrinsic == null ? void 0 : maxExtrinsic.refTime) ? bnToBn(maxExtrinsic.refTime).mul(new BN(reductionFactor * 100)).div(new BN(100)) : new BN(0);
  const maxProofSize = (maxExtrinsic == null ? void 0 : maxExtrinsic.proofSize) ? bnToBn(maxExtrinsic.proofSize).mul(new BN(reductionFactor * 100)).div(new BN(100)) : new BN(0);
  return getGasLimit(api, maxRefTime, maxProofSize);
};

// src/helpers/contractCall.ts
var contractCallDryRun = (_0, _1, _2, _3, ..._4) => __async(void 0, [_0, _1, _2, _3, ..._4], function* (api, account, contract, method, options = {}, args = []) {
  const abiMessage = getAbiMessage(contract, method);
  const address = (account == null ? void 0 : account.address) || account;
  const { value, gasLimit, storageDepositLimit } = options;
  const result = yield api.call.contractsApi.call(
    address,
    contract.address,
    value != null ? value : new BN(0),
    gasLimit != null ? gasLimit : null,
    storageDepositLimit != null ? storageDepositLimit : null,
    abiMessage.toU8a(args)
  );
  return result;
});
var contractQuery = (_0, _1, _2, _3, ..._4) => __async(void 0, [_0, _1, _2, _3, ..._4], function* (api, address, contract, method, options = {}, args = []) {
  const gasLimit = getMaxGasLimit(api);
  const queryFn = contract.query[stringCamelCase(method)];
  return yield queryFn(address, __spreadProps(__spreadValues({}, options), { gasLimit }), ...args);
});
var contractTx = (_0, _1, _2, _3, ..._4) => __async(void 0, [_0, _1, _2, _3, ..._4], function* (api, account, contract, method, options = {}, args = [], statusCb) {
  const hasSufficientBalance = yield checkIfBalanceSufficient(api, account, options == null ? void 0 : options.value);
  if (!hasSufficientBalance) {
    return Promise.reject({
      errorMessage: "TokenBelowMinimum"
    });
  }
  delete options.gasLimit;
  const dryResult = yield contractCallDryRun(api, account, contract, method, options, args);
  const { isError, decodedOutput } = decodeOutput(dryResult, contract, method);
  if (isError)
    return Promise.reject({
      dryResult,
      errorMessage: decodedOutput || "Error"
    });
  const gasLimit = dryResult.gasRequired;
  return new Promise((resolve, reject) => __async(void 0, null, function* () {
    try {
      const isDevelopment = (api.runtimeChain || "").toLowerCase() === "development" ? "isInBlock" : "isFinalized";
      const finalStatus = isDevelopment ? "isInBlock" : "isFinalized";
      const asFinalStatus = isDevelopment ? "asInBlock" : "asFinalized";
      const tx = contract.tx[stringCamelCase(method)](__spreadProps(__spreadValues({}, options), { gasLimit }), ...args);
      const unsub = yield tx.signAndSend(account, (result) => __async(void 0, null, function* () {
        var _a;
        statusCb == null ? void 0 : statusCb(result);
        const isFinalized = (_a = result == null ? void 0 : result.status) == null ? void 0 : _a[finalStatus];
        if (!isFinalized)
          return;
        const extrinsicHash = result.txHash.toHex();
        const extrinsicIndex = result.txIndex;
        const blockHash = result.status[asFinalStatus].toHex();
        const errorEvent = result == null ? void 0 : result.events.find(
          ({ event }) => api.events.system.ExtrinsicFailed.is(event)
        );
        if (errorEvent) {
          reject({
            dryResult,
            errorMessage: decodeOutput || "ExtrinsicFailed",
            errorEvent,
            extrinsicHash,
            extrinsicIndex,
            blockHash
          });
          unsub == null ? void 0 : unsub();
        } else {
          const successEvent = result == null ? void 0 : result.events.find(
            ({ event }) => api.events.system.ExtrinsicSuccess.is(event)
          );
          resolve({
            dryResult,
            result,
            successEvent,
            extrinsicHash,
            extrinsicIndex,
            blockHash
          });
          unsub == null ? void 0 : unsub();
        }
      }));
    } catch (e) {
      console.error("Error during contract transaction:", e);
      reject({ errorMessage: getExtrinsicErrorMessage(e), errorEvent: e });
    }
  }));
});
var deployContract = (_0, _1, _2, _3, ..._4) => __async(void 0, [_0, _1, _2, _3, ..._4], function* (api, account, abi, wasm, constructorMethod = "new", args = [], options = {}) {
  return new Promise((resolve, reject) => __async(void 0, null, function* () {
    const code = new CodePromise(api, abi, wasm);
    const gasLimit = getMaxGasLimit(api);
    const constructorFn = code.tx[stringCamelCase(constructorMethod)];
    const unsub = yield constructorFn(__spreadValues({ gasLimit }, options), ...args).signAndSend(
      account,
      (_02) => __async(void 0, [_02], function* ({ events, contract, status }) {
        var _a, _b;
        if (status == null ? void 0 : status.isInBlock) {
          unsub == null ? void 0 : unsub();
          const extrinsicFailedEvent = events.find(
            ({ event: { method } }) => method === "ExtrinsicFailed"
          );
          if (!!extrinsicFailedEvent || !(contract == null ? void 0 : contract.address)) {
            console.error(
              `Contract '${abi == null ? void 0 : abi.contract.name}' could not be deployed`,
              (_b = (_a = extrinsicFailedEvent == null ? void 0 : extrinsicFailedEvent.event) == null ? void 0 : _a.data) == null ? void 0 : _b.toHuman()
            );
            return reject();
          }
          const hash = abi == null ? void 0 : abi.source.hash;
          const address = contract.address.toString();
          const blockHash = status.asInBlock.toHex();
          const block = yield api.rpc.chain.getBlock(blockHash);
          const blockNumber = block.block.header.number.toNumber();
          console.log(
            `Contract '${abi == null ? void 0 : abi.contract.name}' deployed under ${address} at block #${blockNumber}`
          );
          return resolve({
            address,
            hash,
            block,
            blockNumber
          });
        }
      })
    );
  }));
});

// src/metadata/psp22.json
var psp22_default = { source: { hash: "0xdb433067f226daf1542d03cfb9fb40560381fee51ac41a1fe2344cef297f18e9", language: "ink! 4.0.0", compiler: "rustc 1.65.0", build_info: { build_mode: "Debug", cargo_contract_version: "2.0.0-beta", rust_toolchain: "stable-aarch64-apple-darwin", wasm_opt_settings: { keep_debug_symbols: false, optimization_passes: "Z" } } }, contract: { name: "psp22", version: "0.9.6", authors: ["Yonatan Hornstein <yonatan@panoramaswap.com>"] }, spec: { constructors: [{ args: [{ label: "total_supply", type: { displayName: ["Balance"], type: 0 } }, { label: "name", type: { displayName: ["Option"], type: 4 } }, { label: "symbol", type: { displayName: ["Option"], type: 4 } }, { label: "decimal", type: { displayName: ["u8"], type: 3 } }], label: "new", payable: false, returnType: { displayName: ["ink_primitives", "ConstructorResult"], type: 5 }, selector: "0x9bae9d5e" }], events: [], lang_error: { displayName: ["ink", "LangError"], type: 6 }, messages: [{ args: [{ label: "owner", type: { displayName: ["psp22_external", "BalanceOfInput1"], type: 7 } }], label: "PSP22::balance_of", mutates: false, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 9 }, selector: "0x6568382f" }, { args: [{ label: "from", type: { displayName: ["psp22_external", "TransferFromInput1"], type: 7 } }, { label: "to", type: { displayName: ["psp22_external", "TransferFromInput2"], type: 7 } }, { label: "value", type: { displayName: ["psp22_external", "TransferFromInput3"], type: 0 } }, { label: "data", type: { displayName: ["psp22_external", "TransferFromInput4"], type: 2 } }], label: "PSP22::transfer_from", mutates: true, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 10 }, selector: "0x54b3c76e" }, { args: [{ label: "to", type: { displayName: ["psp22_external", "TransferInput1"], type: 7 } }, { label: "value", type: { displayName: ["psp22_external", "TransferInput2"], type: 0 } }, { label: "data", type: { displayName: ["psp22_external", "TransferInput3"], type: 2 } }], label: "PSP22::transfer", mutates: true, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 10 }, selector: "0xdb20f9f5" }, { args: [{ label: "spender", type: { displayName: ["psp22_external", "ApproveInput1"], type: 7 } }, { label: "value", type: { displayName: ["psp22_external", "ApproveInput2"], type: 0 } }], label: "PSP22::approve", mutates: true, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 10 }, selector: "0xb20f1bbd" }, { args: [], label: "PSP22::total_supply", mutates: false, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 9 }, selector: "0x162df8c2" }, { args: [{ label: "spender", type: { displayName: ["psp22_external", "IncreaseAllowanceInput1"], type: 7 } }, { label: "delta_value", type: { displayName: ["psp22_external", "IncreaseAllowanceInput2"], type: 0 } }], label: "PSP22::increase_allowance", mutates: true, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 10 }, selector: "0x96d6b57a" }, { args: [{ label: "spender", type: { displayName: ["psp22_external", "DecreaseAllowanceInput1"], type: 7 } }, { label: "delta_value", type: { displayName: ["psp22_external", "DecreaseAllowanceInput2"], type: 0 } }], label: "PSP22::decrease_allowance", mutates: true, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 10 }, selector: "0xfecb57d5" }, { args: [{ label: "owner", type: { displayName: ["psp22_external", "AllowanceInput1"], type: 7 } }, { label: "spender", type: { displayName: ["psp22_external", "AllowanceInput2"], type: 7 } }], label: "PSP22::allowance", mutates: false, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 9 }, selector: "0x4d47d921" }, { args: [], label: "PSP22Metadata::token_decimals", mutates: false, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 13 }, selector: "0x7271b782" }, { args: [], label: "PSP22Metadata::token_name", mutates: false, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 14 }, selector: "0x3d261bd4" }, { args: [], label: "PSP22Metadata::token_symbol", mutates: false, payable: false, returnType: { displayName: ["ink", "MessageResult"], type: 14 }, selector: "0x34205be5" }] }, storage: { root: { layout: { struct: { fields: [{ layout: { struct: { fields: [{ layout: { leaf: { key: "0x00000000", ty: 0 } }, name: "supply" }, { layout: { root: { layout: { leaf: { key: "0x1d458d3b", ty: 0 } }, root_key: "0x1d458d3b" } }, name: "balances" }, { layout: { root: { layout: { leaf: { key: "0x0abd72fb", ty: 0 } }, root_key: "0x0abd72fb" } }, name: "allowances" }, { layout: { enum: { dispatchKey: "0x00000000", name: "Option", variants: { "0": { fields: [], name: "None" }, "1": { fields: [{ layout: { leaf: { key: "0x00000000", ty: 1 } }, name: "0" }], name: "Some" } } } }, name: "_reserved" }], name: "Data" } }, name: "psp22" }, { layout: { struct: { fields: [{ layout: { enum: { dispatchKey: "0x00000000", name: "Option", variants: { "0": { fields: [], name: "None" }, "1": { fields: [{ layout: { leaf: { key: "0x00000000", ty: 2 } }, name: "0" }], name: "Some" } } } }, name: "name" }, { layout: { enum: { dispatchKey: "0x00000000", name: "Option", variants: { "0": { fields: [], name: "None" }, "1": { fields: [{ layout: { leaf: { key: "0x00000000", ty: 2 } }, name: "0" }], name: "Some" } } } }, name: "symbol" }, { layout: { leaf: { key: "0x00000000", ty: 3 } }, name: "decimals" }, { layout: { enum: { dispatchKey: "0x00000000", name: "Option", variants: { "0": { fields: [], name: "None" }, "1": { fields: [{ layout: { leaf: { key: "0x00000000", ty: 1 } }, name: "0" }], name: "Some" } } } }, name: "_reserved" }], name: "Data" } }, name: "metadata" }], name: "Contract" } }, root_key: "0x00000000" } }, types: [{ id: 0, type: { def: { primitive: "u128" } } }, { id: 1, type: { def: { tuple: [] } } }, { id: 2, type: { def: { sequence: { type: 3 } } } }, { id: 3, type: { def: { primitive: "u8" } } }, { id: 4, type: { def: { variant: { variants: [{ index: 0, name: "None" }, { fields: [{ type: 2 }], index: 1, name: "Some" }] } }, params: [{ name: "T", type: 2 }], path: ["Option"] } }, { id: 5, type: { def: { variant: { variants: [{ fields: [{ type: 1 }], index: 0, name: "Ok" }, { fields: [{ type: 6 }], index: 1, name: "Err" }] } }, params: [{ name: "T", type: 1 }, { name: "E", type: 6 }], path: ["Result"] } }, { id: 6, type: { def: { variant: { variants: [{ index: 1, name: "CouldNotReadInput" }] } }, path: ["ink_primitives", "LangError"] } }, { id: 7, type: { def: { composite: { fields: [{ type: 8, typeName: "[u8; 32]" }] } }, path: ["ink_primitives", "types", "AccountId"] } }, { id: 8, type: { def: { array: { len: 32, type: 3 } } } }, { id: 9, type: { def: { variant: { variants: [{ fields: [{ type: 0 }], index: 0, name: "Ok" }, { fields: [{ type: 6 }], index: 1, name: "Err" }] } }, params: [{ name: "T", type: 0 }, { name: "E", type: 6 }], path: ["Result"] } }, { id: 10, type: { def: { variant: { variants: [{ fields: [{ type: 11 }], index: 0, name: "Ok" }, { fields: [{ type: 6 }], index: 1, name: "Err" }] } }, params: [{ name: "T", type: 11 }, { name: "E", type: 6 }], path: ["Result"] } }, { id: 11, type: { def: { variant: { variants: [{ fields: [{ type: 1 }], index: 0, name: "Ok" }, { fields: [{ type: 12 }], index: 1, name: "Err" }] } }, params: [{ name: "T", type: 1 }, { name: "E", type: 12 }], path: ["Result"] } }, { id: 12, type: { def: { variant: { variants: [{ fields: [{ type: 2, typeName: "String" }], index: 0, name: "Custom" }, { index: 1, name: "InsufficientBalance" }, { index: 2, name: "InsufficientAllowance" }, { index: 3, name: "ZeroRecipientAddress" }, { index: 4, name: "ZeroSenderAddress" }, { fields: [{ type: 2, typeName: "String" }], index: 5, name: "SafeTransferCheckFailed" }] } }, path: ["openbrush_contracts", "traits", "errors", "psp22", "PSP22Error"] } }, { id: 13, type: { def: { variant: { variants: [{ fields: [{ type: 3 }], index: 0, name: "Ok" }, { fields: [{ type: 6 }], index: 1, name: "Err" }] } }, params: [{ name: "T", type: 3 }, { name: "E", type: 6 }], path: ["Result"] } }, { id: 14, type: { def: { variant: { variants: [{ fields: [{ type: 4 }], index: 0, name: "Ok" }, { fields: [{ type: 6 }], index: 1, name: "Err" }] } }, params: [{ name: "T", type: 4 }, { name: "E", type: 6 }], path: ["Result"] } }], version: "4" };

// src/helpers/getAbi.ts
var psp22Abi = psp22_default;
var getDeployment = (deployments, contractId, networkId) => {
  return deployments.find((deployment) => {
    return deployment.contractId.toLowerCase() === contractId.toLowerCase() && deployment.networkId.toLowerCase() === (networkId || "").toLowerCase();
  });
};
var getDeploymentContract = (api, deployments, contractId, networkId) => {
  const deployment = getDeployment(deployments || [], contractId, networkId);
  if (!deployment)
    return void 0;
  return new ContractPromise(api, deployment == null ? void 0 : deployment.abi, deployment == null ? void 0 : deployment.address);
};

// src/data/PSP22_ASSETS.json
var PSP22_ASSETS_default = {
  "alephzero-PSP22-INW-5H4aCwLKUpVpct6XGJzDGPPXFockNKQU2JUVNgUw6BXEPzST": {
    originChain: "alephzero",
    slug: "alephzero-PSP22-INW-5H4aCwLKUpVpct6XGJzDGPPXFockNKQU2JUVNgUw6BXEPzST",
    name: "Ink Whale Token",
    symbol: "INW",
    decimals: 12,
    assetType: "PSP22",
    metadata: {
      contractAddress: "5H4aCwLKUpVpct6XGJzDGPPXFockNKQU2JUVNgUw6BXEPzST"
    },
    iconPath: "https://github.com/scio-labs/use-inkathon/raw/main/assets/asset-logos/inw.png"
  },
  "alephzero-PSP22-PANX-5GSGAcvqpF5SuH2MhJ1YUdbLAbssCjeqCn2miMUCWUjnr5DQ": {
    originChain: "alephzero",
    slug: "alephzero-PSP22-PANX-5GSGAcvqpF5SuH2MhJ1YUdbLAbssCjeqCn2miMUCWUjnr5DQ",
    name: "Panorama Swap Token",
    symbol: "PANX",
    decimals: 12,
    assetType: "PSP22",
    metadata: {
      contractAddress: "5GSGAcvqpF5SuH2MhJ1YUdbLAbssCjeqCn2miMUCWUjnr5DQ"
    },
    iconPath: "https://github.com/scio-labs/use-inkathon/raw/main/assets/asset-logos/panx.png"
  },
  "alephzero-testnet-PSP22-INW-5FrXTf3NXRWZ1wzq9Aka7kTGCgGotf6wifzV7RzxoCYtrjiX": {
    originChain: "alephzero-testnet",
    slug: "alephzero-testnet-PSP22-INW-5FrXTf3NXRWZ1wzq9Aka7kTGCgGotf6wifzV7RzxoCYtrjiX",
    name: "Ink Whale Token",
    symbol: "INW",
    decimals: 12,
    assetType: "PSP22",
    metadata: {
      contractAddress: "5FrXTf3NXRWZ1wzq9Aka7kTGCgGotf6wifzV7RzxoCYtrjiX"
    },
    iconPath: "https://github.com/scio-labs/use-inkathon/raw/main/assets/asset-logos/inw.png"
  }
};

// src/assets.ts
var allPSP22Assets = PSP22_ASSETS_default;
var PSP22_TOKEN_BALANCE_SUBSCRIPTION_INTERVAL = 6e4;
var getPSP22Balances = (api, address, chainId, formatterOptions) => __async(void 0, null, function* () {
  const psp22ContractMap = {};
  Object.entries(allPSP22Assets).forEach(([slug, tokenInfo]) => {
    var _a;
    psp22ContractMap[slug] = new ContractPromise(api, psp22Abi, (_a = tokenInfo.metadata) == null ? void 0 : _a.contractAddress);
  });
  if (!address) {
    const result2 = Object.values(allPSP22Assets).filter(({ originChain }) => originChain === chainId).map(({ slug, decimals, symbol, iconPath }) => {
      return {
        tokenSlug: slug,
        tokenDecimals: decimals,
        tokenSymbol: symbol,
        iconPath
      };
    });
    return result2;
  }
  const result = yield Promise.all(
    Object.values(allPSP22Assets).filter(({ originChain }) => originChain === chainId).map((_0) => __async(void 0, [_0], function* ({ slug, decimals, symbol, iconPath }) {
      var _a;
      let balance = new BN(0);
      const contract = psp22ContractMap[slug];
      const response = yield contractQuery(api, "", contract, "psp22::balanceOf", {}, [address]);
      const { isError, decodedOutput } = decodeOutput(response, contract, "psp22::balanceOf");
      if (isError)
        throw new Error(decodedOutput);
      const _balance = (_a = response.output) == null ? void 0 : _a.toPrimitive();
      balance = new BN(response.output ? _balance.ok || _balance.Ok : "0");
      if (!balance)
        throw new Error("Invalid fetched balances");
      const data = {
        tokenDecimals: decimals,
        tokenSymbol: symbol,
        balance
      };
      const balanceFormatted = parsePSP22Balance(data, formatterOptions);
      return __spreadValues({
        balanceFormatted,
        tokenSlug: slug,
        iconPath
      }, data);
    }))
  );
  return result;
});
var watchPSP22Balances = (api, address, callback, chainId, formatterOptions) => {
  const psp22ContractMap = {};
  Object.entries(allPSP22Assets).forEach(([slug, tokenInfo]) => {
    var _a;
    psp22ContractMap[slug] = new ContractPromise(api, psp22Abi, (_a = tokenInfo.metadata) == null ? void 0 : _a.contractAddress);
  });
  if (!address) {
    const result = Object.values(allPSP22Assets).filter(({ originChain }) => originChain === chainId).map(({ slug, decimals, symbol, iconPath }) => {
      return {
        tokenSlug: slug,
        tokenDecimals: decimals,
        tokenSymbol: symbol,
        iconPath
      };
    });
    callback(result);
    return null;
  }
  const fetchTokenBalances = () => __async(void 0, null, function* () {
    return callback(
      yield Promise.all(
        Object.values(allPSP22Assets).filter(({ originChain }) => originChain === chainId).map((_0) => __async(void 0, [_0], function* ({ slug, decimals, symbol, iconPath }) {
          var _a;
          let balance = new BN(0);
          const contract = psp22ContractMap[slug];
          const response = yield contractQuery(api, "", contract, "psp22::balanceOf", {}, [
            address
          ]);
          const { isError, decodedOutput } = decodeOutput(response, contract, "psp22::balanceOf");
          if (isError)
            throw new Error(decodedOutput);
          const _balance = (_a = response.output) == null ? void 0 : _a.toPrimitive();
          balance = new BN(
            response.output ? _balance.ok || _balance.Ok : "0"
          );
          if (!balance)
            throw new Error("Invalid fetched balances");
          const data = {
            tokenDecimals: decimals,
            tokenSymbol: symbol,
            balance
          };
          const balanceFormatted = parsePSP22Balance(data, formatterOptions);
          return __spreadValues({
            balanceFormatted,
            tokenSlug: slug,
            iconPath
          }, data);
        }))
      )
    );
  });
  fetchTokenBalances();
  const intervalId = setInterval(fetchTokenBalances, PSP22_TOKEN_BALANCE_SUBSCRIPTION_INTERVAL);
  return () => {
    clearInterval(intervalId);
  };
};
var parsePSP22Balance = (data, formatterOptions) => {
  const { tokenDecimals, tokenSymbol, balance } = data;
  const balanceFormatted = formatBalance(void 0, balance, formatterOptions, {
    tokenDecimals,
    tokenSymbol
  });
  return balanceFormatted;
};
var initPolkadotJs = (chain, options) => __async(void 0, null, function* () {
  const rpcUrl = chain.rpcUrls[0];
  if (!rpcUrl) {
    throw new Error("Given chain has no RPC url defined");
  }
  yield cryptoWaitReady();
  const provider = rpcUrl.startsWith("http") ? new HttpProvider(rpcUrl) : new WsProvider(rpcUrl);
  const api = yield ApiPromise.create(__spreadValues({
    provider
  }, options));
  return { api, provider };
});
var transferBalance = (api, fromAccount, toAddress, amount, allowDeath, statusCb) => __async(void 0, null, function* () {
  const hasSufficientBalance = yield checkIfBalanceSufficient(api, fromAccount, amount);
  if (!hasSufficientBalance) {
    return Promise.reject({ errorMessage: "TokenBelowMinimum" });
  }
  return new Promise((resolve, reject) => __async(void 0, null, function* () {
    try {
      const transferFn = api.tx.balances[allowDeath ? "transferAllowDeath" : "transferKeepAlive"] || api.tx.balances["transfer"];
      const unsub = yield transferFn(toAddress, bnToBn(amount)).signAndSend(
        fromAccount,
        (result) => {
          var _a;
          statusCb == null ? void 0 : statusCb(result);
          const isInBlock = (_a = result == null ? void 0 : result.status) == null ? void 0 : _a.isInBlock;
          if (!isInBlock)
            return;
          const errorEvent = result == null ? void 0 : result.events.find(
            ({ event: { method } }) => method === "ExtrinsicFailed"
          );
          if (isInBlock && errorEvent) {
            reject({ errorMessage: "ExtrinsicFailed", errorEvent });
            unsub == null ? void 0 : unsub();
          } else if (isInBlock) {
            resolve({ result });
            unsub == null ? void 0 : unsub();
          }
        }
      );
    } catch (e) {
      console.error("Error while transferring balance:", e);
      reject({
        errorMessage: getExtrinsicErrorMessage(e),
        errorEvent: e
      });
    }
  }));
});
var transferFullBalance = (api, fromAccount, toAddress, keepAlive, statusCb) => __async(void 0, null, function* () {
  const hasSufficientBalance = yield checkIfBalanceSufficient(api, fromAccount);
  if (!hasSufficientBalance) {
    return Promise.reject({ errorMessage: "TokenBelowMinimum" });
  }
  return new Promise((resolve, reject) => __async(void 0, null, function* () {
    try {
      const unsub = yield api.tx.balances.transferAll(toAddress, !!keepAlive).signAndSend(fromAccount, (result) => {
        var _a;
        statusCb == null ? void 0 : statusCb(result);
        const isInBlock = (_a = result == null ? void 0 : result.status) == null ? void 0 : _a.isInBlock;
        if (!isInBlock)
          return;
        const errorEvent = result == null ? void 0 : result.events.find(
          ({ event: { method } }) => method === "ExtrinsicFailed"
        );
        if (isInBlock && errorEvent) {
          reject({ errorMessage: "ExtrinsicFailed", errorEvent });
          unsub == null ? void 0 : unsub();
        } else if (isInBlock) {
          resolve({ result });
          unsub == null ? void 0 : unsub();
        }
      });
    } catch (e) {
      console.error("Error while transferring full balance:", e);
      reject({
        errorMessage: getExtrinsicErrorMessage(e),
        errorEvent: e
      });
    }
  }));
});

// src/helpers/unwrapResult.ts
var unwrapResultOrError = (outcome) => {
  const { result, output } = outcome;
  if (!(result == null ? void 0 : result.isOk) || !output) {
    throw new Error(`Error while unwrapping: ${result.toString()}`);
  }
  return output.toPrimitive().ok;
};
var unwrapResultOrDefault = (outcome, defaultValue) => {
  const { result, output } = outcome;
  let unwrappedResult = defaultValue;
  if ((result == null ? void 0 : result.isOk) && !!output) {
    unwrappedResult = output.toPrimitive().ok;
  }
  return unwrappedResult;
};

export { PSP22_TOKEN_BALANCE_SUBSCRIPTION_INTERVAL, accountArraysAreEqual, accountsAreEqual, allPSP22Assets, checkIfBalanceSufficient, contractCallDryRun, contractQuery, contractTx, decodeOutput, deployContract, formatBalance, getAbiMessage, getBalance, getDeployment, getDeploymentContract, getExtrinsicErrorMessage, getGasLimit, getMaxGasLimit, getPSP22Balances, initPolkadotJs, parsePSP22Balance, psp22Abi, transferBalance, transferFullBalance, unwrapResultOrDefault, unwrapResultOrError, watchBalance, watchPSP22Balances };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-YSQNQUVI.js.map