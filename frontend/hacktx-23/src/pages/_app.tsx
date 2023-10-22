import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { AppType } from 'next/dist/shared/lib/utils';

import { Karla } from "next/font/google"

import "~/styles/globals.css";
import Link from 'next/link';

type ContextType = {
  userData: any;
  messages: any[];
};

type AppContextType = {
  ctxData: ContextType;
  setCtxData: Dispatch<SetStateAction<ContextType>>;
};

const AppContext = createContext<AppContextType>({ ctxData: { userData: {}, messages: [] }, setCtxData: () => null });

const karla = Karla({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin']
});

export const useAppContext = () => {
  return useContext(AppContext);
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const [ctxData, setCtxData] = useState<ContextType>({ userData: {}, messages: [] });

  return (
    <AppContext.Provider value={{ ctxData, setCtxData }}>
      <Link href={"/"} className='fixed  top-4 left-16 text-2xl font-bold text-emerald-900'>thrifti</Link>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;
