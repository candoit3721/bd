import type { Metadata } from "next";
import { playfair, montserrat, poppins, quicksand, fredokaOne } from "../components/CustomFonts";
import { PartyProvider } from "../contexts/PartyContext";
import { ImagePreloaderProvider } from '../contexts/ImagePreloaderContext';
import { SKYZONE_IMAGES } from '../components/PhotoGallery';
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Sophia's 10th Birthday Party",
  description: "Join us for Sophia's 10th birthday celebration at SkyZone on June 7th at 10AM!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${poppins.variable} ${quicksand.variable} ${fredokaOne.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-party-cream min-h-screen relative overflow-x-hidden">
        <PartyProvider>
          <ImagePreloaderProvider images={SKYZONE_IMAGES}>
            {children}
          </ImagePreloaderProvider>
        </PartyProvider>
      </body>
    </html>
  );
}
