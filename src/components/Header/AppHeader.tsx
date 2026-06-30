"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function AppHeader() {
  const pathname = usePathname();
  const isGamePage = pathname.startsWith("/games/");

  return <Header isGamePage={isGamePage} />;
}
