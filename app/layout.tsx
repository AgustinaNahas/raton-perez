import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ratón Pérez - Visualización de Dientes",
  description: "Descubre cuántos dientes ha recogido el Ratón Pérez este año y dónde está visitando ahora",
  keywords: ["Ratón Pérez", "dientes de leche", "visualización", "datos", "niños"],
  authors: [{ name: "Ratón Pérez Viz" }],
  openGraph: {
    title: "Ratón Pérez - Visualización de Dientes",
    description: "Descubre cuántos dientes ha recogido el Ratón Pérez este año y dónde está visitando ahora",
    url: "https://raton-perez-viz.vercel.app",
    siteName: "Ratón Pérez Viz",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Ratón Pérez - Visualización de Dientes",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratón Pérez - Visualización de Dientes",
    description: "Descubre cuántos dientes ha recogido el Ratón Pérez este año y dónde está visitando ahora",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
