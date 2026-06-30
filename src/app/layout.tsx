import type { Metadata } from "next";
import AppHeader from "@/components/Header/AppHeader";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "NBA Game Flow",
  description: "Static NBA game pages generated from SQLite play-by-play data.",
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
        {children}
      </body>
    </html>
  );
}
