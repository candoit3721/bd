import { Playfair_Display, Montserrat, Quicksand, Poppins } from 'next/font/google';
import localFont from 'next/font/local';

export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
});

// Using Fredoka One for the header
export const fredokaOne = localFont({
  src: '../../public/fonts/FredokaOne-Regular.woff2',
  variable: '--font-fredoka-one',
  display: 'swap',
});