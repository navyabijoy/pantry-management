import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Providers } from "./providers";
import ModalProvider from "@/providers/ModalProvider";
import Header from "./components/Header";
import ToasterProvider from "@/providers/ToasterProvider";
import AuthProvider from "@/providers/AuthProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Up",
  description: "AI Pantry Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <Providers>
              <ModalProvider />
              <AuthProvider>
                <Header />
                {children}
              </AuthProvider>
            </Providers>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
