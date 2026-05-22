import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AIAvatar from "@/components/ui/AIAvatar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Prajwal Chaudhari | AI Portfolio Experience",
  description:
    "Interactive AI-powered portfolio experience. Explore projects, skills, and experience through a futuristic cinematic interface.",
  keywords: [
    "portfolio",
    "developer",
    "software engineer",
    "QA automation",
    "Prajwal Chaudhari",
    "interactive",
    "AI portfolio",
  ],
  authors: [{ name: "Prajwal Chaudhari" }],
  openGraph: {
    title: "Prajwal Chaudhari | AI Portfolio Experience",
    description:
      "Interactive AI-powered portfolio experience with cinematic 3D visuals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-zinc-950 text-white min-h-screen`}
        suppressHydrationWarning
      >
        {children}
        <AIAvatar />
      </body>
    </html>
  );
}
