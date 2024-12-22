import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Fathom from 'fathom-client';

export const FATHOM_EVENTS_ID = {
  137: 'KZQZWMIP',
};

export const FATHOM_DROPDOWN_EVENTS_ID = {
  1: 'XIFGUQQY',
  137: 'C6AYES3T',
};
export const FATHOM_NO_EVENTS_ID = {
  1: '7X05SCBE',
  10: 'UJHQR5AT',
  25: 'VEQDBWGQ',
  56: 'NMO1JLYL',
  137: 'BEKTDT7F',
  250: 'KPCKMPYG',
  8217: '9369UJ80',
  42161: '9DNMZNFD',
  43114: 'FRM17FBN',
};

export const CHAINS_MONITOR = [1, 10, 25, 56, 137, 250, 8217, 42161, 43114];

export const useAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    Fathom.load('TKCNGGEZ', {
      includedDomains: ['chainlist.defillama.com', 'chainlist.org'],
      url: 'https://surprising-powerful.llama.fi/script.js',
    });

    const onRouteChangeComplete = () => {
      Fathom.trackPageview();
    };

    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router.events]);
};
