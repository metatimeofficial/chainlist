import allExtraRpcs from "../constants/extraRpcs.js";
import chainIds from "../constants/chainIds.js";
import fetch from "node-fetch";
import { overwrittenChains } from "../constants/additionalChainRegistry/list.js";

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

function removeEndingSlashObject(rpc) {
  if (typeof rpc === "string") {
    return {
      url: removeEndingSlash(rpc),
    };
  } else {
    return {
      ...rpc,
      url: removeEndingSlash(rpc.url),
    };
  }
}

function removeEndingSlash(rpc) {
  return rpc.endsWith("/") ? rpc.substr(0, rpc.length - 1) : rpc;
}

export function populateChain(chain, chainTvls) {
  let rpcs = (allExtraRpcs[chain.chainId]?.rpcs ?? []).map(removeEndingSlashObject);

  for (const rpcUrl of chain.rpc) {
    const rpc = removeEndingSlashObject(rpcUrl);

    if (!rpc.url.includes("${INFURA_API_KEY}") && !rpcs.find((r) => r.url === rpc.url)) {
      rpcs = [...rpcs, rpc];
    }
  }

  chain.rpc = rpcs;

  const chainSlug = chainIds[chain.chainId];

  if (chainSlug !== undefined) {
    const defiChain = chainTvls.find((c) => c.name.toLowerCase() === chainSlug);

    return defiChain === undefined
      ? chain
      : {
          ...chain,
          tvl: defiChain.tvl,
          chainSlug,
        };
  }

  return chain;
}

export function mergeDeep(target, source) {
  const newTarget = { ...target };
  const isObject = (obj) => obj && typeof obj === "object";

  if (!isObject(newTarget) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = newTarget[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      newTarget[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      newTarget[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      newTarget[key] = sourceValue;
    }
  });

  return newTarget;
}

export function arrayMove(array, fromIndex, toIndex) {
  const newArray = [...array];
  const startIndex = fromIndex < 0 ? newArray.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < newArray.length) {
    const endIndex = toIndex < 0 ? newArray.length + toIndex : toIndex;
    const [item] = newArray.splice(fromIndex, 1);

    newArray.splice(endIndex, 0, item);
  }

  return newArray;
}

export async function generateChainData() {
  const [chains, chainTvls] = await Promise.all([
    fetcher("https://chainid.network/chains.json"),
    fetcher("https://api.llama.fi/chains")
  ]);

  const overwrittenIds = overwrittenChains.reduce((acc, curr) => {
    acc[curr.chainId] = true;
    return acc;
  }, {});

  const sortedChains = chains
    .filter((c) => c.status !== "deprecated" && !overwrittenIds[c.chainId])
    .concat(overwrittenChains)
    .map((chain) => populateChain(chain, chainTvls))
    .sort((a, b) => {
      return (b.tvl ?? 0) - (a.tvl ?? 0);
    });

  return sortedChains;
}
