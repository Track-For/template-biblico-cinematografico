import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "A Jornada Divina",
  description:
    "Uma travessia cinematográfica pela escolha, pelo abismo e pela luz.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080806",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
