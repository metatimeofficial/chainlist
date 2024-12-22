import { useState, useEffect } from "react";
import en from "../translations/en.json";
import zh from "../translations/zh.json";

export function formatCurrency(amount, decimals = 2) {
  if (!isNaN(amount)) {
    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(amount);
  } else {
    return 0;
  }
}

export function formatAddress(address, length = "short") {
  if (address && length === "short") {
    address = address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
    return address;
  } else if (address && length === "long") {
    address = address.substring(0, 12) + "..." + address.substring(address.length - 8, address.length);
    return address;
  } else {
    return null;
  }
}

export function getProvider() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    if (window.ethereum.isCoinbaseWallet || window.ethereum.selectedProvider?.isCoinbaseWallet)
      return "Coinbase Wallet";
    if (window.ethereum.isXDEFI) return "XDEFI";
    if (window.ethereum.isTally) return "Taho";
    if (window.ethereum.isBraveWallet) return "Brave Wallet";
    if (window.ethereum.isMetaMask) return "Metamask";
    if (window.ethereum.isImToken) return "imToken";
    if (window.ethereum.isTrust) return "Trust Wallet";
  }
  return "Wallet";
}

export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const renderProviderText = (address) => {
  if (address) {
    const providerTextList = {
      Metamask: "add-to-metamask",
      XDEFI: "add-to-xdefi",
      imToken: "add-to-imToken",
      Wallet: "add-to-wallet",
      "Brave Wallet": "add-to-brave",
      "Coinbase Wallet": "add-to-coinbase",
      Taho: "add-to-taho",
      "Trust Wallet": "add-to-trust",
    };
    return providerTextList[getProvider()];
  } else {
    return "connect-wallet";
  }
};

export const notTranslation =
  (ns, lang = "en") =>
  (key) => {
    switch (lang) {
      case "en":
        return en[ns][key];
      case "zh":
        return zh[ns][key];
      default:
        return en[ns][key];
    }
  };
