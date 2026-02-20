import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prime Vault - Institutional DeFi Prime Brokerage",
  description: "Secure, compliant prime brokerage for decentralized finance on Arbitrum",
  keywords: ["DeFi", "prime brokerage", "institutional", "Arbitrum", "multi-sig", "Safe"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
