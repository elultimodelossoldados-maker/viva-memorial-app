import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "VIVA - La Red Social Memorial del Mundo",
    description: "Honra la memoria de tus seres queridos. La primera red social memorial del mundo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
          <html lang="es">
                <body className={inter.className}>
                        <AuthProvider>{children}</AuthProvider>AuthProvider>
                </body>body>
          </html>html>
        );
}
</html>
