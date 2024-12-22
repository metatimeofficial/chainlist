import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Chain from "../components/chain";
import { AdBanner } from "../components/AdBanner";
import { generateChainData } from "../utils/fetch";

export async function getStaticProps() {
  const sortedChains = await generateChainData();

  return {
    props: {
      chains: sortedChains,
      // messages: (await import(`../translations/${locale}.json`)).default,
    },
    revalidate: 3600,
  };
}

function Home({ chains }) {
  const [chainName, setChainName] = React.useState("");

  const router = useRouter();
  const { testnets, testnet, search } = router.query;

  const chainToFilter =
    search && search.length > 0 && chainName.length === 0
      ? typeof search === "string"
        ? search
        : search[0]
      : chainName;

  const includeTestnets =
    (typeof testnets === "string" && testnets === "true") || (typeof testnet === "string" && testnet === "true");

  const finalChains = React.useMemo(() => {
    let finalChains = [];
    for (const chain of chains) {
      let toFilter = true;

      if (!includeTestnets) {
        toFilter = !(
          chain.name?.toLowerCase().includes("test") ||
          chain.title?.toLowerCase().includes("test") ||
          chain.network?.toLowerCase().includes("test") ||
          chain.name?.toLowerCase().includes("devnet") ||
          chain.title?.toLowerCase().includes("devnet") ||
          chain.network?.toLowerCase().includes("devnet")
        );
      }

      if (chainToFilter.length > 0 && toFilter) {
        toFilter =
          chain.chain.toLowerCase().includes(chainToFilter.toLowerCase()) ||
          chain.chainId.toString().toLowerCase().includes(chainToFilter.toLowerCase()) ||
          chain.name.toLowerCase().includes(chainToFilter.toLowerCase()) ||
          (chain.nativeCurrency ? chain.nativeCurrency.symbol : "").toLowerCase().includes(chainToFilter.toLowerCase());
      }

      if (toFilter) {
        finalChains.push(chain);
      }
    }

    return finalChains;
  }, [includeTestnets, chainToFilter, chains]);

  const [end, setEnd] = React.useState(15);

  return (
    <>
      <Head>
        <title>ChainList</title>
        <meta
          name="description"
          content="ChainList is a list of RPCs for EVM(Ethereum Virtual Machine) networks. Use the information to connect your wallets and Web3 middleware providers to the appropriate Chain ID and Network ID. Find the best RPC for both Mainnet and Testnet to connect to the correct chain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout chainName={chainName} setChainName={setChainName}>
        <React.Suspense fallback={<div className="h-screen"></div>}>
          <div className="dark:text-[#B3B3B3] text-black grid gap-5 grid-cols-1 place-content-between pb-4 sm:pb-10 sm:grid-cols-[repeat(auto-fit,_calc(50%_-_15px))] 3xl:grid-cols-[repeat(auto-fit,_calc(33%_-_20px))] isolate grid-flow-dense">
            {finalChains.slice(0, 2).map((chain) => {
              return <Chain chain={chain} key={JSON.stringify(chain) + "en"} lang="en" />;
            })}
            <AdBanner />
            {finalChains.slice(2, end).map((chain) => {
              return <Chain chain={chain} key={JSON.stringify(chain) + "en"} lang="en" />;
            })}
          </div>
        </React.Suspense>
        {end - 1 < finalChains.length ? (
          <button
            onClick={() => setEnd(finalChains.length)}
            className="w-full border dark:border-[#171717] border-[#EAEAEA] px-4 py-2 rounded-[50px] mb-auto text-white bg-[#2F80ED] mx-auto"
          >
            Show all
          </button>
        ) : null}
      </Layout>
    </>
  );
}

export default Home;
