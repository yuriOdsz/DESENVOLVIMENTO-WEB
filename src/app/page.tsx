import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  FileUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
export default function Home() {
  return (
    <>
      <section className="site-container grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-800">
            <Sparkles size={14} /> Seu próximo capítulo começa aqui
          </span>
          <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-[-.055em] sm:text-6xl">
            Grandes histórias
            <br />
            merecem{" "}
            <span className="text-teal-700">
              novas
              <br />
              oportunidades.
            </span>
          </h1>
          <p className="muted mt-6 max-w-md text-lg">
            Reúna talentos, organize trajetórias e encontre o próximo passo.
            Seus currículos, em um lugar feito para simplificar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/curriculos/cadastrar">
                Criar meu currículo <ArrowRight size={17} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/curriculos/visualizar">Explorar talentos</Link>
            </Button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <Check size={14} className="text-teal-700" /> Simples de usar · Sem
            cadastro de conta
          </p>
        </div>
        <div className="relative rounded-[32px] bg-[#e5eee8] px-7 py-12 sm:px-12">
          <div className="absolute right-6 top-5 flex gap-1">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            <span className="h-2 w-2 rounded-full bg-teal-800" />
          </div>
          <Card className="relative rotate-[-3deg] shadow-xl shadow-teal-900/10">
            <div className="flex items-center justify-between">
              <Image
                src="/avatar.svg"
                width={64}
                height={64}
                alt="Avatar ilustrativo de candidato"
              />
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-700">
                Uma nova possibilidade
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-bold">Ana Silva</h2>
            <p className="mt-1 text-sm text-slate-500">Designer de produto</p>
            <div className="my-6 border-t border-slate-100" />
            <p className="eyebrow">Mais que um currículo. Uma trajetória.</p>
            <p className="muted mt-3 text-sm">
              Criatividade para transformar ideias em experiências que fazem a
              diferença.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["UX Design", "Pesquisa", "Figma"].map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5 text-xs">
              <span className="text-slate-400">Talento em destaque</span>
              <FileUser size={20} className="text-teal-700" />
            </div>
          </Card>
          <div className="relative -mt-2 ml-auto flex w-fit rotate-3 items-center gap-3 rounded-xl bg-teal-900 p-4 text-white shadow-lg">
            <span className="rounded-full bg-white/15 p-2">
              <Check size={20} />
            </span>
            <div className="text-sm font-semibold">
              Seu talento, bem apresentado.
              <p className="mt-1 text-xs font-normal text-teal-100">
                Pronto para o próximo passo.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="site-container">
          <div className="mb-10 text-center">
            <p className="eyebrow">Menos burocracia, mais possibilidades</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Espaço para cada conquista.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                Layers,
                "Tudo organizado",
                "Experiências, formação e habilidades reunidas em um perfil completo.",
              ],
              [
                Search,
                "Encontre com facilidade",
                "Busque talentos por nome ou cargo e conheça suas trajetórias.",
              ],
              [
                ShieldCheck,
                "No seu navegador",
                "Dados salvos localmente, disponíveis ao retornar neste dispositivo.",
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof Layers;
              return (
                <Card
                  key={String(title)}
                  className="border-0 bg-slate-50 shadow-none"
                >
                  <I className="mb-5 text-teal-700" size={25} />
                  <h3 className="font-bold">{String(title)}</h3>
                  <p className="muted mt-3 text-sm">{String(desc)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="site-container py-16">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-teal-900 p-9 text-white">
          <div>
            <h2 className="text-2xl font-bold">Uma trajetória única. A sua.</h2>
            <p className="mt-3 text-sm text-teal-100">
              Dê o primeiro passo e organize seu currículo hoje.
            </p>
          </div>
          <Button asChild className="bg-white text-teal-900 hover:bg-teal-50">
            <Link href="/curriculos/cadastrar">
              Começar agora <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
