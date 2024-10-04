import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Gumroad Description Generator",
  description: "Generate descriptions for your Gumroad products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-full flex flex-col bg-slate-50`}
      >
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Gumroad Description Generator
            </h1>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2024{" "}
              <a href="https://x.com/alecdewitz" target="_blank">
                Alec Dewitz
              </a>
              . All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
