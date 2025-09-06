import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HabitProvider } from "./context/HabitContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenetic Mind",
  description: "Build micro-habits for a better you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HabitProvider>{children}</HabitProvider>
      </body>
    </html>
  );
}
