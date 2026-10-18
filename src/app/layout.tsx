import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header, Footer } from "@/components/shell";
export const metadata: Metadata = {
  title: {
    default: "Curricula | Histórias que abrem portas",
    template: "%s | Curricula",
  },
  description:
    "Organize experiências, destaque habilidades e gerencie currículos em um só lugar.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <a href="#conteudo" className="skip-link">
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
