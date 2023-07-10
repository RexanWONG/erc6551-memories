import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Goerli } from "@thirdweb-dev/chains";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={Goerli}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
