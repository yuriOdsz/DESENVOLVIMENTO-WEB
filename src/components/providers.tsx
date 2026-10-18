"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Toaster, toast } from "sonner";
import { mocks, type Curriculo } from "@/lib/curriculos";
const Context = createContext<{
  items: Curriculo[];
  ready: boolean;
  save: (item: Curriculo) => boolean;
  remove: (id: string) => boolean;
}>({ items: [], ready: false, save: () => false, remove: () => false });
const KEY = "curricula:v1";
export function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Curriculo[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (
            !Array.isArray(parsed) ||
            !parsed.every(
              (i) =>
                typeof i?.id === "string" &&
                typeof i?.nome === "string" &&
                typeof i?.cargo === "string" &&
                Array.isArray(i?.experiencias) &&
                Array.isArray(i?.formacoes),
            )
          )
            throw Error();
          setItems(parsed);
        } else {
          localStorage.setItem(KEY, JSON.stringify(mocks));
          setItems(mocks);
        }
      } catch {
        toast.error("Não foi possível carregar os dados locais.", {
          description:
            "Verifique o armazenamento do navegador. Nenhum dado foi sobrescrito.",
        });
      } finally {
        setReady(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const persist = useCallback((next: Curriculo[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setItems(next);
      return true;
    } catch {
      toast.error("Não foi possível salvar.", {
        description: "O armazenamento pode estar cheio ou bloqueado.",
      });
      return false;
    }
  }, []);
  return (
    <Context.Provider
      value={{
        items,
        ready,
        save: (item) =>
          persist(
            items.some((i) => i.id === item.id)
              ? items.map((i) => (i.id === item.id ? item : i))
              : [item, ...items],
          ),
        remove: (id) => persist(items.filter((i) => i.id !== id)),
      }}
    >
      {children}
      <Toaster richColors position="top-right" closeButton />
    </Context.Provider>
  );
}
export const useCurriculos = () => useContext(Context);
