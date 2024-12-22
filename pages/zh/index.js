import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Chain from "../../components/chain";
import { generateChainData } from "../../utils/fetch";

export async function getStaticProps() {
  const sortedChains = await generateChainData();

  return {
    props: {
      chains: sortedChains,
      // messages: (await import(`../../translations/${locale}.json`)).default,
    },
    revalidate: 3600,
  };
}

function Home({ chains }) {
  const [chainName, setChainName] = React.useState("");

  const router = useRouter();
  const { testnets, testnet, search } = router.query;

  const chainToFilter = search?.length > 0 && chainName.length === 0 ? search : chainName;

  const includeTestnets =
    (typeof testnets === "string" && testnets === "true") || (typeof testnet === "string" && testnet === "true");

  const sortedChains = !includeTestnets
    ? chains.filter((item) => {
        const testnet =
          item.name?.toLowerCase().includes("test") ||
          item.title?.toLowerCase().includes("test") ||
          item.network?.toLowerCase().includes("test");
        const devnet =
          item.name?.toLowerCase().includes("devnet") ||
          item.title?.toLowerCase().includes("devnet") ||
          item.network?.toLowerCase().includes("devnet");
        return !testnet && !devnet;
      })
    : chains;

  const filteredChains =
    !chainToFilter || typeof chainToFilter !== "string" || chainToFilter === ""
      ? sortedChains
      : sortedChains.filter((chain) => {
          //filter
          return (
            chain.chain.toLowerCase().includes(chainToFilter.toLowerCase()) ||
            chain.chainId.toString().toLowerCase().includes(chainToFilter.toLowerCase()) ||
            chain.name.toLowerCase().includes(chainToFilter.toLowerCase()) ||
            (chain.nativeCurrency ? chain.nativeCurrency.symbol : "")
              .toLowerCase()
              .includes(chainToFilter.toLowerCase())
          );
        });
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

      <Layout lang="zh" chainName={chainName} setChainName={setChainName}>
        <React.Suspense fallback={<div className="h-screen"></div>}>
          <div className="grid gap-5 grid-cols-1 place-content-between pb-4 sm:pb-10 sm:grid-cols-[repeat(auto-fit,_calc(50%_-_15px))] 3xl:grid-cols-[repeat(auto-fit,_calc(33%_-_20px))] isolate grid-flow-dense">
            {filteredChains.map((chain) => (
              <Chain chain={chain} key={JSON.stringify(chain) + "zh"} lang="zh" />
            ))}
          </div>
        </React.Suspense>
      </Layout>
    </>
  );
}

export default Home;
