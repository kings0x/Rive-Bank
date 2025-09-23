import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rive Banking - Exclusive Banking for the Elite",
  description:
    "Ultra-luxury digital banking for high-net-worth individuals. Banking for the 1% of the 1%.",
  verification: {
    google: '4MGxH68iBfFg_ImUHDh9D1mDdUjHQ2-3SnRezge5_IE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} dark`}>
      <body className="font-sans antialiased">
        {/* Global toast notifications */}
        <Toaster position="top-right" richColors />

        {children}

        {/* --- Tawk.to Chat Widget --- */}
        <Script id="tawk-init" strategy="afterInteractive">
          {`

            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/68c4824f2d363c192cbad5d6/1j4vpq25c';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();

          `}
        </Script>
      </body>
    </html>
  );
}
