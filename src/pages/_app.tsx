import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PartyProvider } from '../contexts/PartyContext';
import { ImagePreloaderProvider } from '../contexts/ImagePreloaderContext';
import { UIProvider } from '../contexts/UIContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PartyProvider>
      <ImagePreloaderProvider>
        <UIProvider>
          <main>
            <Component {...pageProps} />
          </main>
        </UIProvider>
      </ImagePreloaderProvider>
    </PartyProvider>
  );
}
