import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "../contexts/CartContext";
import { ToastProvider } from "../components/ToastContainer";
import { LoadingProvider } from "../contexts/LoadingContext";
import NavigationHandler from "../components/NavigationHandler";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-basic-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hygieia - Kurumsal Çözüm Ortağınız",
  description: "Hygieia ile fark yaratmanın tam zamanı! Kağıt ürünleri, temizlik ürünleri, kırtasiye ve gıda ürünleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WTCCK84G');`}
        </Script>
      </head>
      <body className={`antialiased ${inter.variable} font-basic-sans`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WTCCK84G"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <LoadingProvider>
          <NavigationHandler />
          <ToastProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
