import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { AppType } from 'next/dist/shared/lib/utils';

import "~/styles/globals.css";

type ContextType = {
  userData: any;
  messages: any[];
};

type AppContextType = {
  ctxData: ContextType;
  setCtxData: Dispatch<SetStateAction<ContextType>>;
};

const AppContext = createContext<AppContextType>({ ctxData: { userData: {}, messages: [] }, setCtxData: () => null });

export const useAppContext = () => {
  return useContext(AppContext);
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const [ctxData, setCtxData] = useState<ContextType>({ userData: {}, messages: [] });

  return (
    <AppContext.Provider value={{ ctxData, setCtxData }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;
