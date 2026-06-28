import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { BRAND_ASSETS } from "@/lib/brand-assets";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ruta Cero",
  description: "Tu plan inteligente para salir de deudas",
  icons: {
    icon: BRAND_ASSETS.rutaCero.appIcon,
    apple: BRAND_ASSETS.rutaCero.appIcon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
