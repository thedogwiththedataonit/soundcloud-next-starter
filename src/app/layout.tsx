import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MusicPlayerProvider } from "@/contexts/music-player-context";
import { MusicPlayerBar } from "@/components/music-player-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoundCloud Search",
  description: "Search and discover music from SoundCloud's vast library",
  keywords: ["soundcloud", "music", "search", "songs", "tracks", "artists"],
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
        <MusicPlayerProvider>
          {children}
          <MusicPlayerBar />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
