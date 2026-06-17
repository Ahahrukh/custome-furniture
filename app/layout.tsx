import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crown Atelier Furniture",
  description: "Royal custom furniture storefront built with Next.js and Framer Motion."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
