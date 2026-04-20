import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Superlabs — Desktop Prototype",
  description:
    "Clickable prototype of Superlabs: teach a desktop assistant to automate repetitive tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
