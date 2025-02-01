// pages/_app.js
import "../styles/globals.css";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ToastProviderComponent } from "@/components/ui/use-toast";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ToastProviderComponent>
          <Component {...pageProps} />
        </ToastProviderComponent>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
