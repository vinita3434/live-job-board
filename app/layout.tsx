import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "goodput — live AI infra roles",
  description:
    "A live job board pulling roles directly from company ATS career APIs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
