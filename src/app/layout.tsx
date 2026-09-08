import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "StřihAI — YouTube video na 15s sestřih s titulky",
  description:
    "Vlož odkaz na YouTube video a StřihAI z něj během pár vteřin udělá krátký 15sekundový sestřih s vypálenými titulky. Jako Opus Clip, ale růžové.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
