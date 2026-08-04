import type { Metadata } from "next";
// @ts-expect-error -- Global CSS import handled by Next.js.
import "./globals.css";

export const metadata: Metadata = {
  title: "Guerrilla Com",
  description: "Plateforme de gestion Guerrilla Com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      {/* 
        La classe "font-sans" va maintenant chercher Century Gothic 
        comme configuré dans ton globals.css ! 
      */}
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}