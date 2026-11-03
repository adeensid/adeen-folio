import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adeen Siddiqui, Developer",
  description: "Adeen Ahmed Siddiqui, full-stack developer in Islamabad. Web, Android and applied AI projects.",
  openGraph: {
    title: "Adeen Siddiqui, Developer",
    description: "Full-stack web, Android and applied AI projects.",
    type: "website",
    images: [{ url: "/img/adeen.jpg", width: 900, height: 1351, alt: "Portrait of Adeen Ahmed Siddiqui" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEEAE2" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1311" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" />
        <script src="/theme-init.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
