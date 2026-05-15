import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "VIVA — La Red Social Memorial del Mundo",
  description:
    "La primera red social memorial, genealógica y emocional del mundo. Preserva el legado de tu familia con amor eterno.",
  keywords:
    "memorial, genealogía, familia, recuerdos, árbol genealógico, México, legado, VIVA",
  openGraph: {
    title: "VIVA — La Red Social Memorial del Mundo",
    description:
      "Preserva el legado de tu familia. Una celebración eterna del amor, la memoria y el legado familiar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
