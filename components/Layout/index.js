import * as React from "react";
import { useEffect } from "react";
import Header from "../header";
// import { useTranslations } from "next-intl";
import { notTranslation as useTranslations } from "../../utils";
import Logo from "./Logo";

const toggleTheme = (e) => {
  e.preventDefault();
  const element = document.body;
  document.getElementById("theme-toggle-dark-icon").classList.toggle("hidden");
  document.getElementById("theme-toggle-light-icon").classList.toggle("hidden");
  const result = element.classList.toggle("dark");
  localStorage.setItem("theme", result ? "dark" : "light");
};

const initTheme = () => {
  const element = document.body;
  if (element.classList.contains("dark")) {
    document.getElementById("theme-toggle-light-icon").classList.remove("hidden");
  } else {
    document.getElementById("theme-toggle-dark-icon").classList.remove("hidden");
  }
};

export default function Layout({ children, lang, chainName, setChainName }) {
  useEffect(() => {
    initTheme();
  }, []);

  const t = useTranslations("Common", lang);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40vw,_auto]">
      <div className="dark:text-[#B3B3B3] text-black dark:bg-[#0D0D0D] bg-white relative h-full">
        <div className="p-5 sticky top-0 bottom-0 m-auto flex flex-col items-center gap-8 justify-center h-screen max-w-[480px] mx-auto">
          <figure className="lg:mr-auto">
            <Logo />
            <figcaption className="font-bold text-2xl">{t("help-info")}</figcaption>
          </figure>

          <h1 className="font-medium text-base">{t("description")}</h1>

          <div className="flex flex-col gap-4 w-full">
            <a
              className="flex items-center justify-center mx-auto lg:ml-0 gap-2 rounded-[50px] max-w-[16.25rem] font-medium py-[18px] px-6 shadow-lg w-full dark:bg-[#2F80ED] bg-[#2F80ED] dark:text-black text-white"
              href="https://github.com/ethereum-lists/chains"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-base font-medium">{t("add-your-network")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[22px] h-[22px]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </a>

            <a
              className="flex items-center justify-center mx-auto lg:ml-0 gap-2 rounded-[50px] max-w-[16.25rem] font-medium py-[17px] px-6 w-full dark:bg-[#0D0D0D] bg-white dark:text-[#2F80ED] text-[#2F80ED] border dark:border-[#171717] border-[#EAEAEA]"
              href="https://github.com/DefiLlama/chainlist/blob/main/constants/extraRpcs.js"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-base font-medium">{t("add-your-rpc")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[22px] h-[22px]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </a>
          </div>

          <a
            className="flex items-center gap-2 mx-auto lg:ml-0"
            href="https://github.com/DefiLlama/chainlist"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg version="1.1" className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill={"#2F80ED"}
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
            <span className="text-base font-medium">{t("view-source-code")}</span>
          </a>

          <a className="flex items-center gap-2 mx-auto lg:ml-0" href="#" onClick={toggleTheme} id="theme-toggle">
            <svg
              id="theme-toggle-dark-icon"
              className="w-5 h-5 hidden"
              fill="#2F80ED"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            <svg
              id="theme-toggle-light-icon"
              className="w-5 h-5 hidden"
              fill="#2F80ED"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-base font-medium">{t("toggle-theme")}</span>
          </a>
        </div>
      </div>
      <div className="dark:bg-[#181818] bg-[#f3f3f3] p-5 relative flex flex-col gap-5">
        <Header lang={lang} chainName={chainName} setChainName={setChainName} />
        {children}
      </div>
    </div>
  );
}
