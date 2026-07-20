import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "@/components/Header/AppHeader";
import Footer from "@/components/Footer/Footer";
import "../styles/globals.scss";

const SITE_DESCRIPTION = "In-depth visual breakdowns of NBA games — shot charts, lineups, and scoring trends.";

export const metadata: Metadata = {
  title: "Hoop State Gameflows",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Hoop State Gameflows",
    description: SITE_DESCRIPTION,
    siteName: "Hoop State Gameflows",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hoop State Gameflows",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <main className="mainContent">{children}</main>
        <Footer />
        <Script
          src="https://analytics.hoopstate.net/script.js"
          data-website-id="7e114cfd-b360-40f2-a931-e201ffdcd60a"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
