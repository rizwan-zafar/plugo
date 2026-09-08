import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/common/SiteChrome";
import { CartProvider } from "@/components/cart/CartContext";
import { ToastProvider } from "@/components/common/ToastContext";

const heading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "Plugo | Mobile Accessories for Everyday Speed",
  description:
    "Shop charging cables, adapters, earbuds, handsfree and power banks from Plugo. Fast, durable accessories with Cash on Delivery across Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ToastProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
