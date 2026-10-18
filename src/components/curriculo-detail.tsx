"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useCurriculos } from "./providers";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ListSkeleton } from "./curriculo-list";
export default function CurriculoDetail({ id }: { id: string }) {
  const { items, ready, remove } = useCurriculos();
  const router = useRouter();
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    setWaiting(true);
    const t = setTimeout(() => setWaiting(false), 450);
    return () => clearTimeout(t);
  }, [id]);
  if (!ready || waiting) return <ListSkeleton />;
  const item = items.find((i) => i.id === id);
  if (!item)
    return (
      <Card className="py-16 text-center">
        <h1 className="page-title">Currículo não encontrado</h1>
        <p className="muted my-5">
          Este perfil foi removido ou o endereço está incorreto.
        </p>
        <Button asChild>
          <Link href="/curriculos/visualizar">Voltar aos currículos</Link>
        </Button>
      </Card>
    );
  const erase = async () => {
    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: "Excluir este currículo?",
      text: `O perfil de ${item.nome} será removido deste navegador.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b91c1c",
    });
    if (result.isConfirmed && remove(item.id)) {
      toast.success("Currículo excluído com sucesso.");
      router.push("/curriculos/visualizar");
    }
  };
  return (
    <>
      <Link
        href="/curriculos/visualizar"
        className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft size={16} /> Todos os currículos
      </Link>
      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <Image
              src={item.foto || "/avatar.svg"}
              width={88}
              height={88}
              unoptimized={item.foto.startsWith("data:")}
              alt={`Foto de ${item.nome}`}
              className="h-22 w-22 rounded-2xl object-cover"
            />
            <div>
              <p className="eyebrow">Perfil profissional</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {item.nome}
              </h1>
              <p className="mt-2 text-teal-700">{item.cargo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/curriculos/cadastrar?editar=${item.id}`}>
                <Pencil size={15} />
                Editar
              </Link>
            </Button>
            <Button variant="destructive" onClick={erase}>
              <Trash2 size={15} />
              Excluir
            </Button>
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <h2 className="section-title">Sobre o profissional</h2>
            <p className="muted mt-4 whitespace-pre-wrap">{item.resumo}</p>
          </Card>
          {[
            {
              title: "Experiência profissional",
              Icon: BriefcaseBusiness,
              data: item.experiencias.map((e) => ({
                title: e.cargo,
                subtitle: e.empresa,
                ...e,
              })),
            },
            {
              title: "Formação acadêmica",
              Icon: GraduationCap,
              data: item.formacoes.map((f) => ({
                title: f.curso,
                subtitle: f.instituicao,
                descricao: "",
                ...f,
              })),
            },
          ].map((section) => (
            <Card key={section.title}>
              <h2 className="section-title flex items-center gap-2">
                <section.Icon size={20} className="text-teal-700" />
                {section.title}
              </h2>
              {section.data.length ? (
                section.data.map((entry, n) => (
                  <div key={n} className="mt-6 border-l-2 border-teal-200 pl-5">
                    <h3 className="font-semibold">{entry.title}</h3>
                    <p className="mt-1 text-sm text-teal-700">
                      {entry.subtitle}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {entry.inicio} — {entry.fim || "Atual"}
                    </p>
                    {entry.descricao && (
                      <p className="muted mt-3 whitespace-pre-wrap text-sm">
                        {entry.descricao}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="muted mt-4 text-sm">
                  Nenhuma informação adicionada.
                </p>
              )}
            </Card>
          ))}
        </div>
        <aside className="space-y-6">
          <Card>
            <h2 className="section-title">Contato e dados</h2>
            <div className="mt-5 space-y-4 break-words text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <Mail size={17} className="shrink-0" />
                {item.email}
              </p>
              <p className="flex gap-2">
                <Phone size={17} />
                {item.telefone}
              </p>
              <p className="flex gap-2">
                <MapPin size={17} />
                {item.cidade}
              </p>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">Nascimento</p>
                <p className="mt-1">{item.nascimento}</p>
                <p className="mt-4 text-xs text-slate-400">
                  CPF · dados demonstrativos
                </p>
                <p className="mt-1">{item.cpf}</p>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="section-title">Habilidades</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.habilidades.split(",").map((s, n) => (
                <span
                  key={n}
                  className="rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800"
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
