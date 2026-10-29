import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inter-Hall Sports | Annual Championship",
  description: "Live scores, fixtures, standings and eligibility checker for the Inter-Hall Annual Sports Championship — Blue, Black, Gold and Purple Hall.",
  keywords: "inter-hall sports, championship, live scores, fixtures, standings",
  openGraph: {
    title: "Inter-Hall Sports Championship",
    description: "Live scores, fixtures and hall standings",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="animated-gradient min-h-screen">
        {children}
      </body>
    </html>
  );
}
