import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserInitializationComponent } from "./initialize-user";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wordle",
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
        <UserInitializationComponent />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "!bg-white !text-black !shadow-lg !rounded-md !p-3 !max-w-xs",
            duration: 3000, // Auto-close after 3 seconds
          }}
        />
      </body>
    </html>
  );
}
