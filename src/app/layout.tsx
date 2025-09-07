import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Sistema de Cadastros",
  description: "Aplicação web para gerenciamento de cadastros com CRUD completo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-gray-50"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {children}
        <Toaster 
          position="top-right"
          richColors
          expand={false}
          duration={4000}
        />
      </body>
    </html>
  );
}