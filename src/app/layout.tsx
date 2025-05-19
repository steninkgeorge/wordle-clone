import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserInitializationComponent } from "./initialize-user";
import { Toaster } from "@/components/ui/sonner";

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
          visibleToasts={3}
          expand={false}
          richColors
          closeButton
          theme="light"
          toastOptions={{
            unstyled: false,
            classNames: {
              toast:
                "!bg-white !text-black !border !border-gray-200 !shadow-lg",
              title: "!font-medium",
              description: "!text-sm !opacity-90",
              actionButton: "!bg-gray-100 hover:!bg-gray-200",
              closeButton: "!text-gray-500 hover:!text-gray-700",
            },
          }}
        />
      </body>
    </html>
  );
}
