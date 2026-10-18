import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CurriculoList from "@/components/curriculo-list";
export const metadata = { title: "Currículos" };
export default function Page() {
  return (
    <div className="site-container py-12">
      <p className="eyebrow">Conexões começam com histórias</p>
      <div className="mb-9 mt-3 flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="page-title">Conheça os talentos.</h1>
          <p className="muted mt-3">
            Trajetórias diferentes. Possibilidades infinitas.
          </p>
        </div>
        <Button asChild>
          <Link href="/curriculos/cadastrar">
            <Plus size={16} /> Novo currículo
          </Link>
        </Button>
      </div>
      <CurriculoList />
    </div>
  );
}
