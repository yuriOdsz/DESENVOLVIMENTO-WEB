"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useForm,
  useFieldArray,
  Controller,
  type FieldErrors,
  type Path,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMask from "@/vendor/react-input-mask-next";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Upload,
  Save,
  ArrowLeft,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";
import { schema, defaults, type FormValues } from "@/lib/curriculos";
import { useCurriculos } from "./providers";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ListSkeleton } from "./curriculo-list";
function firstError(errors: FieldErrors<FormValues>): string {
  for (const value of Object.values(errors)) {
    if (value && typeof value === "object") {
      if ("message" in value && typeof value.message === "string")
        return value.message;
      const nested = firstError(value as FieldErrors<FormValues>);
      if (nested) return nested;
    }
  }
  return "";
}
export default function CurriculoForm() {
  const { items, ready, save } = useCurriculos();
  const edit = useSearchParams().get("editar");
  const router = useRouter();
  const initialized = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getFieldState,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: defaults,
    mode: "onChange",
  });
  const experiences = useFieldArray({ control, name: "experiencias" });
  const education = useFieldArray({ control, name: "formacoes" });
  useEffect(() => {
    if (ready && initialized.current !== (edit || "new")) {
      const item = items.find((i) => i.id === edit);
      reset(item || defaults);
      initialized.current = edit || "new";
    }
  }, [ready, edit, items, reset]);
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, [isDirty]);
  const foto = watch("foto");
  const field = (
    name: Path<FormValues>,
    label: string,
    options: {
      mask?: string;
      type?: string;
      placeholder?: string;
      area?: boolean;
      optional?: boolean;
    } = {},
  ) => {
    const error = getFieldState(name).error;
    const id = name.replaceAll(".", "-");
    return (
      <div key={name}>
        <label htmlFor={id}>
          {label}
          {!options.optional && <span className="text-teal-700"> *</span>}
        </label>
        {options.mask ? (
          <Controller
            control={control}
            name={name}
            render={({ field: { ref, ...props } }) => (
              <InputMask
                {...props}
                value={typeof props.value === "string" ? props.value : ""}
                ref={ref as never}
                id={id}
                mask={options.mask!}
                maskPlaceholder={null}
                placeholder={options.placeholder}
                inputMode="numeric"
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
              />
            )}
          />
        ) : options.area ? (
          <textarea
            id={id}
            {...register(name)}
            placeholder={options.placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        ) : (
          <input
            id={id}
            {...register(name)}
            type={options.type || "text"}
            placeholder={options.placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        )}{" "}
        {error && (
          <p id={`${id}-error`} className="mt-2 text-xs text-red-600">
            {error.message}
          </p>
        )}
      </div>
    );
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      toast.error("Imagem inválida.", {
        description: "Escolha JPG, PNG ou WebP com até 2 MB.",
      });
      return;
    }
    setUploading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const image = new window.Image();
      image.src = data;
      await image.decode();
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 320 / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas
        .getContext("2d")!
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      setValue("foto", canvas.toDataURL("image/jpeg", 0.8), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setFileName(file.name);
      toast.success("Foto adicionada.", {
        description: "Upload simulado: a imagem ficará apenas neste navegador.",
      });
    } catch {
      toast.error("Não foi possível ler a imagem.");
    } finally {
      setUploading(false);
    }
  };
  if (!ready) return <ListSkeleton />;
  if (edit && !items.some((i) => i.id === edit))
    return (
      <Card>
        <h1 className="section-title">Currículo não encontrado</h1>
        <Button asChild className="mt-5">
          <Link href="/curriculos/visualizar">Voltar à lista</Link>
        </Button>
      </Card>
    );
  const submit = handleSubmit(
    async (values) => {
      await new Promise((r) => setTimeout(r, 450));
      const old = items.find((i) => i.id === edit);
      if (
        save({
          ...values,
          id: old?.id || crypto.randomUUID(),
          criadoEm: old?.criadoEm || new Date().toISOString(),
        })
      ) {
        toast.success(
          edit ? "Currículo atualizado!" : "Currículo cadastrado!",
          { description: "Sua trajetória foi salva neste navegador." },
        );
        router.push("/curriculos/visualizar");
      }
    },
    (error) =>
      toast.error("Revise os campos do formulário.", {
        description: firstError(error),
      }),
  );
  return (
    <>
      <Link
        href="/curriculos/visualizar"
        className="inline-flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft size={16} /> Voltar aos currículos
      </Link>
      <p className="eyebrow mt-8">Sua história tem valor</p>
      <h1 className="page-title mt-3">
        {edit ? "Atualize sua trajetória." : "Vamos apresentar seu talento."}
      </h1>
      <p className="muted mb-8 mt-3">
        Preencha suas informações. Campos com * são obrigatórios.
      </p>
      <form
        onSubmit={submit}
        noValidate
        className="grid items-start gap-7 lg:grid-cols-[1fr_280px]"
      >
        <div className="space-y-6">
          <Card>
            <h2 className="section-title mb-6 flex gap-2">
              <UserRound className="text-teal-700" size={22} /> Informações
              pessoais
            </h2>
            <div className="mb-7 flex flex-wrap items-center gap-5 rounded-xl bg-slate-50 p-5">
              <Image
                src={foto || "/avatar.svg"}
                alt="Prévia da foto do currículo"
                width={72}
                height={72}
                unoptimized={foto.startsWith("data:")}
                className="h-18 w-18 rounded-xl object-cover"
              />
              <div>
                <label
                  htmlFor="foto"
                  className="flex cursor-pointer items-center gap-2 text-teal-800"
                >
                  <Upload size={16} />
                  {uploading ? "Processando..." : "Adicionar foto"}
                </label>
                <input
                  id="foto"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploading || isSubmitting}
                  onChange={(e) => {
                    void upload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                  className="max-w-full text-xs text-slate-500"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {fileName || "JPG, PNG ou WebP. Até 2 MB. Upload simulado."}
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {field("nome", "Nome completo", {
                placeholder: "Como você se chama?",
              })}
              {field("cargo", "Cargo desejado", {
                placeholder: "Ex.: Desenvolvedor frontend",
              })}
              {field("email", "E-mail", {
                type: "email",
                placeholder: "voce@exemplo.com",
              })}
              {field("telefone", "Telefone", {
                mask: "(99) 99999-9999",
                placeholder: "(11) 99999-9999",
              })}
              {field("cpf", "CPF", {
                mask: "999.999.999-99",
                placeholder: "000.000.000-00",
              })}
              {field("nascimento", "Data de nascimento", {
                mask: "99/99/9999",
                placeholder: "DD/MM/AAAA",
              })}
              {field("cidade", "Cidade e estado", {
                placeholder: "Ex.: São Paulo, SP",
              })}
            </div>
          </Card>
          <Card>
            <h2 className="section-title mb-6">Seu perfil profissional</h2>
            <div className="space-y-5">
              {field("resumo", "Resumo profissional", {
                area: true,
                placeholder:
                  "Conte sobre sua trajetória, seus objetivos e o que você faz de melhor. Mínimo de 30 caracteres.",
              })}
              {field("habilidades", "Habilidades", {
                placeholder: "React, Comunicação, Trabalho em equipe",
              })}
              <p className="text-xs text-slate-500">
                Separe suas habilidades por vírgulas.
              </p>
            </div>
          </Card>
          <Card>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="section-title flex items-center gap-2">
                <BriefcaseBusiness size={21} className="text-teal-700" />
                Experiências
              </h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  experiences.append({
                    empresa: "",
                    cargo: "",
                    inicio: "",
                    fim: "",
                    descricao: "",
                  })
                }
              >
                <Plus size={15} />
                Adicionar
              </Button>
            </div>
            <p className="muted mb-5 text-sm">
              Inclua suas experiências profissionais. Está começando? Você pode
              deixar esta seção vazia.
            </p>
            {experiences.fields.map((f, index) => (
              <div
                key={f.id}
                className="mt-5 rounded-xl border border-slate-200 bg-slate-50/50 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Experiência {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Remover experiência ${index + 1}`}
                    onClick={() => experiences.remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {field(`experiencias.${index}.empresa`, "Empresa")}
                  {field(`experiencias.${index}.cargo`, "Cargo")}
                  {field(`experiencias.${index}.inicio`, "Início", {
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA",
                  })}
                  {field(
                    `experiencias.${index}.fim`,
                    "Término (vazio se atual)",
                    {
                      mask: "99/99/9999",
                      placeholder: "DD/MM/AAAA",
                      optional: true,
                    },
                  )}
                  <div className="sm:col-span-2">
                    {field(
                      `experiencias.${index}.descricao`,
                      "Atividades e conquistas",
                      {
                        area: true,
                        placeholder:
                          "Descreva suas atividades (mínimo de 15 caracteres).",
                      },
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="section-title flex items-center gap-2">
                <GraduationCap size={22} className="text-teal-700" />
                Formações
              </h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  education.append({
                    instituicao: "",
                    curso: "",
                    inicio: "",
                    fim: "",
                  })
                }
              >
                <Plus size={15} />
                Adicionar
              </Button>
            </div>
            <p className="muted text-sm">
              Adicione cursos, graduações e outras conquistas acadêmicas.
            </p>
            {education.fields.map((f, index) => (
              <div
                key={f.id}
                className="mt-5 rounded-xl border border-slate-200 bg-slate-50/50 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Formação {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Remover formação ${index + 1}`}
                    onClick={() => education.remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {field(`formacoes.${index}.instituicao`, "Instituição")}
                  {field(`formacoes.${index}.curso`, "Curso")}
                  {field(`formacoes.${index}.inicio`, "Início", {
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA",
                  })}
                  {field(`formacoes.${index}.fim`, "Término (vazio se atual)", {
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA",
                    optional: true,
                  })}
                </div>
              </div>
            ))}
          </Card>
        </div>
        <aside className="lg:sticky lg:top-6">
          <Card>
            <span className="eyebrow">Quase lá</span>
            <h2 className="section-title mt-3">Seu próximo passo</h2>
            <p className="muted my-4 text-sm">
              Revise as informações e salve seu currículo. Você poderá editar
              tudo depois.
            </p>
            <Button
              className="w-full"
              type="submit"
              disabled={!isValid || isSubmitting || uploading}
            >
              <Save size={16} />
              {isSubmitting
                ? "Salvando..."
                : edit
                  ? "Salvar alterações"
                  : "Salvar currículo"}
            </Button>
            {!isValid && (
              <>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Preencha os campos obrigatórios para habilitar o salvamento.
                </p>
                <button
                  type="button"
                  onClick={() => void submit()}
                  className="mt-3 text-xs font-semibold text-teal-800 underline"
                >
                  Verificar campos pendentes
                </button>
              </>
            )}
            <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
              Dados locais: use informações fictícias nesta demonstração. Não há
              envio para um servidor.
            </p>
          </Card>
        </aside>
      </form>
    </>
  );
}
