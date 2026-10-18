import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="site-container py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="page-title mt-4">Página não encontrada.</h1>
      <p className="muted my-6">
        O endereço que você procurou não está disponível.
      </p>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
