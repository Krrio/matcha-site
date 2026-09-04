import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matchacho — Fresh Pressed Matcha",
  description:
    "Authentic Japanese matcha crafted from first-harvest tea leaves for sustained energy, focus, and daily wellness.",
};

export const viewport: Viewport = {
  themeColor: "#f6f5ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
