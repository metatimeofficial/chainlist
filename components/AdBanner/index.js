import { useCallback, useEffect, useRef, useState } from "react";
import { Native } from "@hypelab/sdk-react";
import { HYPELAB_NATIVE_PLACEMENT_SLUG } from "../../constants/hypelab";

export const AdBanner = () => {
  const [isSquare, setIsSquare] = useState(false);
  const [hideNativeTextContent, setHideNativeTextContent] = useState(true);
  const resizeObserver = useRef(null);

  const imageRef = useCallback((node) => {
    if (node) resizeObserver.current?.observe(node);
  }, []);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setIsSquare(entry.contentRect.width == entry.contentRect.height);
          setHideNativeTextContent(entry.contentRect.height > 220);
        }
      }
    });
  }, [setIsSquare, setHideNativeTextContent]);

  return (
    <Native placement={HYPELAB_NATIVE_PLACEMENT_SLUG}>
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div
          className={`flex flex-col w-fit max-w-full bg-white dark:bg-[#0D0D0D] rounded-[10px] shadow overflow-hidden ${
            isSquare ? "max-w-[260px] lg:max-w-[290px]" : ""
          }`}
        >
          <div className="flex" ref={imageRef}>
            <NativeLink>
              <div className="relative">
                <div data-ref="mediaContent" className="h-fit w-fit"></div>

                <HypeLabOverlay />
              </div>
            </NativeLink>
          </div>
          <NativeTextContent hidden={isSquare || hideNativeTextContent} />
        </div>
      </div>
    </Native>
  );
};

const NativeTextContent = ({ hidden }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    const container = containerRef.current;

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [containerRef]);

  return (
    <div
      className={`flex items-center justify-center px-3 py-3 w-full h-full ${hidden ? "hidden" : ""}`}
      id="ctaContainer"
      ref={containerRef}
    >
      <AdvertiserIcon small={width < 300} />
      <div className="grow flex items-center justify-between overflow-hidden">
        <div className="grow truncate">
          <AdvertiserName small={width < 300} />
        </div>
        <div className="flex-none ml-4">
          <AdvertiserCta small={width < 300} />
        </div>
      </div>
    </div>
  );
};

const AdvertiserIcon = ({ small = false }) => {
  return (
    <div className="flex-none mr-2">
      <NativeLink>
        <img data-ref="icon" className={`${small ? "w-8" : "w-10"} rounded-full`} alt="icon" />
      </NativeLink>
    </div>
  );
};

const AdvertiserName = ({ small = false }) => {
  return (
    <div
      className={`${
        small ? "text-sm" : ""
      } font-semibold overflow-hidden text-ellipsis relative top-[1px] dark:text-[#B3B3B3]`}
    >
      <NativeLink>
        <span data-ref="advertiser"></span>
      </NativeLink>
    </div>
  );
};

const AdvertiserCta = ({ ad, small = false }) => {
  return (
    <div className="flex-none">
      <NativeLink>
        <div
          data-ref="ctaText"
          className={`${
            small ? "text-sm px-2 py-1" : "px-4 py-2"
          } border dark:border-[#171717] border-[#EAEAEA] text-center rounded-[50px] dark:text-[#2F80ED] text-[#2F80ED] dark:hover:text-black hover:text-white dark:hover:bg-[#2F80ED] hover:bg-[#2F80ED] truncate`}
        ></div>
      </NativeLink>
    </div>
  );
};

const NativeLink = ({ children }) => {
  return (
    <a data-ref="ctaLink" href="#!" target="_blank">
      {children}
    </a>
  );
};

const HypeLabOverlay = () => {
  const iconStyle = {
    width: "18px",
    height: "18px",
    backgroundSize: "15px 15px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url('data:image/svg+xml,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_466_1481)"><path fill-rule="evenodd" clip-rule="evenodd" d="M25.1879 2.89648C25.0902 2.89648 24.9994 2.94681 24.9476 3.02965L12.771 22.5122C12.712 22.6065 12.7799 22.7289 12.8911 22.7289H19.5615C19.6592 22.7289 19.75 22.6786 19.8018 22.5958L31.9784 3.11322C32.0374 3.01887 31.9695 2.89648 31.8583 2.89648H25.1879ZM12.4386 9.27098C12.3409 9.27098 12.2501 9.3213 12.1984 9.40414L0.0217591 28.8867C-0.0372113 28.981 0.0306218 29.1034 0.141887 29.1034H6.81229C6.90997 29.1034 7.00077 29.0531 7.05254 28.9703L19.2291 9.48772C19.2881 9.39337 19.2203 9.27098 19.109 9.27098H12.4386Z" fill="url(%23paint0_linear_466_1481)"/></g><defs><linearGradient id="paint0_linear_466_1481" x1="31.972" y1="2.89648" x2="12.6357" y2="22.7287" gradientUnits="userSpaceOnUse"><stop stop-color="%238235FF"/><stop offset="1" stop-color="%234330F2"/></linearGradient><clipPath id="clip0_466_1481"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>')`,
  };

  return (
    <div className="flex flex-row absolute top-0 right-0 bg-black/30 items-center pr-2 hover:translate-x-0 translate-x-[calc(100%-18px)] duration-500 transition-transform">
      <div style={iconStyle}></div>
      <div className="text-white text-xs h-[15px]">Ads by HypeLab</div>
    </div>
  );
};
