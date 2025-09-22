import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`antialiased ${inter.variable} font-basic-sans`}>
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
