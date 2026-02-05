import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Celo Salong | Professionell Barbershop i Malmö",
  description: "Professionell herrfrisör i Malmö. Klassiska klippningar, rakning och skäggtrimning. 4.6 stjärnor på Google. Boka din tid idag!",
  keywords: ["barbershop", "malmö", "herrfrisör", "klippning", "rakning", "skägg", "celo salong"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
