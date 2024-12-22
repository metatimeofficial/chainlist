import Document, { Head, Main, NextScript, Html } from "next/document";
import Script from "next/script";
import React from "react";
import { HYPELAB_API_URL, HYPELAB_PROPERTY_SLUG } from "../constants/hypelab";

const LANGUAGES = ["en", "zh"];

function presetTheme() {
  const dark = localStorage.getItem("theme") === "dark";

  if (dark) {
    document.body.classList.add("dark");
  }
}

const themeScript = `(() => { ${presetTheme.toString()}; presetTheme() })()`;

class MyDocument extends Document {
  render() {
    const pathPrefix = this.props.__NEXT_DATA__.page.split("/")[1];
    const lang = LANGUAGES.indexOf(pathPrefix) !== -1 ? pathPrefix : LANGUAGES[0];

    return (
      <Html lang={lang}>
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <Script
            id="hypelab"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!(function (h, y, p, e, l, a, b) {
                ((l = document.createElement(h)).async = !0),
                  (l.src = y),
                  (l.onload = function () {
                    (a = { URL: p, propertySlug: e, environment: '<environment>' }), HypeLab.initialize(a);
                  }),
                  (b = document.getElementsByTagName(h)[0]).parentNode.insertBefore(l, b);
              })('script', 'https://api.hypelab.com/v1/scripts/hp-sdk.js?v=0', '${HYPELAB_API_URL}', '${HYPELAB_PROPERTY_SLUG}');`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
