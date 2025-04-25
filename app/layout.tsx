'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { UserProvider } from '@/context/UserContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className=" antialiased min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto py-0 bg-gray-50 dark:bg-gray-900">
                {children}
              </main>
            </div>
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
