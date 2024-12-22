import * as Fathom from "fathom-client";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { FATHOM_EVENTS_ID, FATHOM_DROPDOWN_EVENTS_ID, FATHOM_NO_EVENTS_ID, CHAINS_MONITOR } from "./useAnalytics";
import { connectWallet } from "./useConnect";
import { llamaNodesRpcByUrl } from "../constants/llamaNodesRpcs";

const toHex = (num) => {
  return "0x" + num.toString(16);
};

export async function addToNetwork({ address, chain, rpc }) {
  try {
    if (window.ethereum) {
      if (!address) {
        await connectWallet();
      }

      const rpcUrls = rpc ? [rpc] : chain.rpc.map((r) => r?.url ?? r)

      const params = {
        chainId: toHex(chain.chainId), // A 0x-prefixed hexadecimal string
        chainName: llamaNodesRpcByUrl[rpcUrls[0]]?.name || chain.name,
        nativeCurrency: {
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol, // 2-6 characters long
          decimals: chain.nativeCurrency.decimals,
        },
        rpcUrls,
        blockExplorerUrls: [
          chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
            ? chain.explorers[0].url
            : chain.infoURL,
        ],
      };

      const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params, address],
      });

      // the 'wallet_addEthereumChain' method returns null if the request was successful
      if (result === null && CHAINS_MONITOR.includes(chain.chainId)) {
        if (rpc && rpc.includes("llamarpc")) {
          Fathom.trackGoal(FATHOM_DROPDOWN_EVENTS_ID[chain.chainId], 0);
        } else if (!rpc && chain.rpc?.length > 0 && chain.rpc[0].url.includes("llamarpc")) {
            Fathom.trackGoal(FATHOM_EVENTS_ID[chain.chainId], 0);
        } else {
          Fathom.trackGoal(FATHOM_NO_EVENTS_ID[chain.chainId], 0);
        }
      }

      return result;
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default function useAddToNetwork() {
  const queryClient = new QueryClient();

  return useMutation(addToNetwork, {
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });
}
