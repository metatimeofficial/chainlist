import { useQuery } from "@tanstack/react-query";

async function getAccount() {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      return {
        chainId: window.networkVersion ? Number(window.networkVersion) : null,
        address: accounts && accounts.length > 0 ? (accounts[0]) : null,
        isConnected: window.ethereum.connected ? true : false,
      };
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    console.log(error);
    return { chainId: null, address: null, isConnected: false };
  }
}

export default function useAccount() {
  return useQuery(["accounts"], () => getAccount());
}
