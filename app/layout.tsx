import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Political Compass Quiz",
  description: "20-question political quiz with two-axis scoring."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
