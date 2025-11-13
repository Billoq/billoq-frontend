// Temporary shim to provide missing sync actions expected by wagmi when using
// viem versions that no longer export them. We forward everything else to the
// actual viem actions implementation.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - importing from the ESM bundle keeps the original exports intact.
import * as viemActions from "viem/_esm/actions/index.js";

export * from "viem/_esm/actions/index.js";

// Provide shims for deprecated sync helpers by delegating to the async variants.
type SendTransactionType = (typeof viemActions)["sendTransaction"];
type SendCallsType = (typeof viemActions)["sendCalls"];

const sendTransaction = viemActions.sendTransaction as SendTransactionType;
const sendCalls = (viemActions.sendCalls ?? (async () => {
  throw new Error("sendCalls is not available in the current viem version.");
})) as SendCallsType;

export const sendTransactionSync: SendTransactionType = sendTransaction;
export const sendCallsSync: SendCallsType = sendCalls;

