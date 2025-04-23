import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PartyProvider } from '../contexts/PartyContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PartyProvider>
      <main>
        <Component {...pageProps} />
      </main>
    </PartyProvider>
  );
}
