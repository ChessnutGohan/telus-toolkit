import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import LoginGate from "@/components/LoginGate";
import Sidebar from "@/components/Sidebar";
import MangaRootWrapper from "@/components/MangaRootWrapper";
import { Caveat } from "next/font/google";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-hand",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Operator Console — Telus Toolkit",
  description: "Personal reference toolkit: scripts, vocabulary, and technical sheets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable} ${handwritten.variable}`}>
      <body className="bg-ink font-body text-ivory antialiased">
        <svg style={{ position:'absolute',width:0,height:0}}>
          <defs>
            <filter id="rough">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="5"
                seed="2"
              />
              <feDisplacementMap in="SourceGraphic" scale="3" />
            </filter>
          </defs>
        </svg>
        <AuthProvider>
          <LoginGate>
            <LangProvider>
              <ThemeProvider>
                <div className="flex min-h-screen flex-col md:flex-row">
                  <Sidebar />
                  <main className="flex-1 bg-dot-grid [background-size:16px_16px]">
                    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
                      <MangaRootWrapper>
                        {children}
                      </MangaRootWrapper>
                    </div>
                  </main>
                </div>
              </ThemeProvider>
            </LangProvider>
          </LoginGate>
        </AuthProvider>
      </body>
    </html>
  );
}
