import * as React from "react";
import { useRouter } from "next/router";
// import { useTranslations } from "next-intl";
import { notTranslation as useTranslations } from "../../utils";
import { formatAddress, getProvider } from "../../utils";
import { walletIcons } from "../../constants/walletIcons";
import useConnect from "../../hooks/useConnect";
import useAccount from "../../hooks/useAccount";

function Header({ lang, chainName, setChainName }) {
  const t = useTranslations("Common", lang);

  const router = useRouter();

  const { testnets, testnet, search } = router.query;

  const includeTestnets =
    (typeof testnets === "string" && testnets === "true") || (typeof testnet === "string" && testnet === "true");

  const toggleTestnets = () =>
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, testnets: !includeTestnets },
      },
      undefined,
      { shallow: true },
    );

  const timeout = React.useRef(null);

  const { mutate: connectWallet } = useConnect();

  const { data: accountData } = useAccount();

  const address = accountData?.address ?? null;

  return (
    <div className="sticky top-0 z-50 rounded-[10px] dark:bg-[#181818] bg-[#f3f3f3] p-5 -m-5">
      <header className="flex items-end gap-2 w-full sticky top-4 shadow rounded-[10px] z-50">
        <div className="flex flex-col dark:bg-[#0D0D0D] bg-white rounded-[10px] flex-1">
          <div className="rounded-t-[10px] shadow-sm">
            <label className="flex sm:items-center flex-col sm:flex-row focus-within:ring-2 dark:ring-[#2F80ED] ring-[#2F80ED] rounded-t-[10px]">
              <span className="font-bold text-sm dark:text-[#B3B3B3] text-black whitespace-nowrap px-3 pt-4 sm:pt-0">
                {t("search-networks")}
              </span>
              {setChainName ? (
                <input
                  placeholder="ETH, Fantom, ..."
                  autoFocus
                  value={chainName}
                  onChange={(e) => {
                    setChainName(e.target.value);
                  }}
                  onKeyUp={(event) => {
                    clearTimeout(timeout.current);
                    timeout.current = setTimeout(() => {
                      router
                        .push(
                          {
                            pathname: router.pathname.includes("/chain/") ? "/" : router.pathname,
                            query: { ...router.query, search: event.target.value },
                          },
                          undefined,
                          { shallow: true },
                        )
                        .then(() => {
                          clearTimeout(timeout.current);
                        });
                    }, 1000);
                  }}
                  className="dark:bg-[#0D0D0D] bg-white dark:text-[#B3B3B3] text-black flex-1 px-3 sm:px-2 pb-4 pt-2 sm:py-4 outline-none"
                />
              ) : (
                <input
                  placeholder="ETH, Fantom, ..."
                  autoFocus
                  defaultValue={search ?? ""}
                  onKeyUp={(event) => {
                    clearTimeout(timeout.current);
                    timeout.current = setTimeout(() => {
                      router
                        .push(
                          {
                            pathname: router.pathname.includes("/chain/") ? "/" : router.pathname,
                            query: { ...router.query, search: event.target.value },
                          },
                          undefined,
                          { shallow: true },
                        )
                        .then(() => {
                          clearTimeout(timeout.current);
                        });
                    }, 100);
                  }}
                  className="dark:bg-[#0D0D0D] bg-white dark:text-[#B3B3B3] text-black flex-1 px-3 sm:px-2 pb-4 pt-2 sm:py-4 outline-none"
                />
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="dark:stroke-[#B3B3B3] stroke-black w-4 h-4 mr-3 hidden sm:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </label>
          </div>
          <div className="dark:text-[#B3B3B3] text-black py-2 px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="testnets" checked={includeTestnets} onChange={toggleTestnets} />
              <span>Include Testnets</span>
            </label>

            <button
              className="flex gap-2 items-center dark:bg-[#212121] bg-[#DEDEDE] justify-center rounded-[10px] py-[8px] px-8 font-medium dark:text-[#B3B3B3] text-black"
              onClick={connectWallet}
            >
              {address ? (
                <>
                  <img src={walletIcons[getProvider()]} width={20} height={20} alt="" />
                  <span>{formatAddress(address)}</span>
                </>
              ) : (
                t("connect-wallet")
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
