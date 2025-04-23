import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PartyProvider } from '../contexts/PartyContext';
import { ImagePreloaderProvider } from '../contexts/ImagePreloaderContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PartyProvider>
      <ImagePreloaderProvider>
        <main>
          <Component {...pageProps} />
        </main>
      </ImagePreloaderProvider>
    </PartyProvider>
  );
}
