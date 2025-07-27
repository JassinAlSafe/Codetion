import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeNotion - Modern Code Editor",
  description: "A beautiful, Notion-inspired code editor built with Next.js, TypeScript, and Monaco Editor",
  keywords: ["code editor", "monaco", "notion", "nextjs", "typescript"],
  authors: [{ name: "CodeNotion Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
