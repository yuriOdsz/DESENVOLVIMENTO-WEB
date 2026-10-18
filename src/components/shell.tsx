"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileUser, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Header() {
  const path = usePathname();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="site-container flex flex-wrap items-center justify-between gap-4 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="rounded-xl bg-teal-800 p-2 text-white">
            <FileUser size={23} />
          </span>
          curricula<span className="text-teal-700">.</span>
        </Link>
        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-5 text-sm font-medium"
        >
          {[
            ["/", "Início"],
            ["/curriculos/visualizar", "Currículos"],
          ].map(([url, label]) => (
            <Link
              key={url}
              href={url}
              aria-current={
                (
                  url === "/"
                    ? path === "/"
                    : path.startsWith("/curriculos/visualizar")
                )
                  ? "page"
                  : undefined
              }
              className={
                (
                  url === "/"
                    ? path === "/"
                    : path.startsWith("/curriculos/visualizar")
                )
                  ? "nav-active"
                  : "text-slate-500 hover:text-teal-800"
              }
            >
              {label}
            </Link>
          ))}
          <Button asChild>
            <Link href="/curriculos/cadastrar">
              <Plus size={16} /> Novo currículo
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="site-container flex flex-wrap items-center justify-between gap-4 py-7 text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} Curricula · Cada trajetória tem valor.
        </p>
        <Link
          href="/curriculos/visualizar"
          className="flex items-center gap-1 hover:text-teal-800"
        >
          Explorar currículos <ArrowUpRight size={15} />
        </Link>
        <span>Projeto acadêmico · SENAI</span>
      </div>
    </footer>
  );
}
