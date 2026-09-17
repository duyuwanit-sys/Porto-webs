import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./refinement.css";
import "./experience.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "Adiwangsa — Systems, Security & Robotics",
  description: "Portfolio cybersecurity, embedded systems, and software development.",
};
export const viewport: Viewport = { themeColor: "#06090e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className={`${mono.variable} ${grotesk.variable}`}><body>{children}</body></html>;
}
