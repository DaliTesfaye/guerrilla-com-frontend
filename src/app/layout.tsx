import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "Guerrilla Com",
  description: "Guerrilla Com Agence de publicitée. Leader du marché en tunisie. En collaboration avec microsoft et land'or et plusieurs autres marques internationales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}