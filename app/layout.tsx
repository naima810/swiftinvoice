import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter,  } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "SwiftInvoice",
  description: "Your modern invoice SaaS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-white`}
      >

        <main>{children}</main>
      </body>
    </html>
  );
}