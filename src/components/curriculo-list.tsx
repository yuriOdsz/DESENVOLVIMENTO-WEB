"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight, MapPin, FileUser, Plus } from "lucide-react";
import { useCurriculos } from "./providers";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
export function ListSkeleton() {
  return (
    <div
      aria-label="Carregando currículos"
      role="status"
      className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <Skeleton className="h-14 w-14" />
          <Skeleton className="mt-5 h-6 w-3/4" />
          <Skeleton className="mt-3 h-4 w-1/2" />
          <Skeleton className="mt-6 h-20 w-full" />
        </Card>
      ))}
    </div>
  );
}
export default function CurriculoList() {
  const { items, ready } = useCurriculos();
  const [query, setQuery] = useState("");
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = items.filter((i) =>
    normalize(i.nome + " " + i.cargo).includes(normalize(query.trim())),
  );
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-3.5 text-slate-400"
          />
          <input
            aria-label="Buscar por nome ou cargo"
            placeholder="Busque por nome ou cargo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <p className="text-sm text-slate-500" aria-live="polite">
          {ready
            ? `${filtered.length} currículo${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}`
            : "Carregando talentos..."}
        </p>
      </div>
      {!ready ? (
        <ListSkeleton />
      ) : filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <Card
              key={i.id}
              className="flex flex-col transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <Image
                  src={i.foto || "/avatar.svg"}
                  width={56}
                  height={56}
                  unoptimized={i.foto.startsWith("data:")}
                  className="h-14 w-14 rounded-2xl object-cover"
                  alt={`Foto de ${i.nome}`}
                />
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-800">
                  Perfil
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold">{i.nome}</h2>
              <p className="mt-1 text-sm font-medium text-teal-700">
                {i.cargo}
              </p>
              <p className="muted my-5 line-clamp-3 text-sm">{i.resumo}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {i.habilidades
                  .split(",")
                  .slice(0, 3)
                  .map((h, n) => (
                    <span
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      key={n}
                    >
                      {h.trim()}
                    </span>
                  ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-5">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={13} />
                  {i.cidade}
                </span>
                <Link
                  className="flex items-center gap-1 text-sm font-semibold text-teal-800 hover:underline"
                  href={`/curriculos/visualizar/${i.id}`}
                >
                  Ver perfil <ArrowUpRight size={16} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <FileUser className="mx-auto mb-5 text-teal-700" size={48} />
          <h2 className="section-title">
            {items.length
              ? "Nenhum talento encontrado"
              : "Cada história começa com um primeiro passo"}
          </h2>
          <p className="muted mb-6 mt-3">
            {items.length
              ? "Experimente buscar por outro nome ou cargo."
              : "Adicione seu primeiro currículo e comece a organizar suas conquistas."}
          </p>
          {items.length ? (
            <Button variant="outline" onClick={() => setQuery("")}>
              Limpar busca
            </Button>
          ) : (
            <Button asChild>
              <Link href="/curriculos/cadastrar">
                <Plus size={16} />
                Criar meu primeiro currículo
              </Link>
            </Button>
          )}
        </Card>
      )}
    </>
  );
}
