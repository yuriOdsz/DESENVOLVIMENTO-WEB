import * as yup from "yup";
const required = (label: string, min = 2) =>
  yup
    .string()
    .trim()
    .min(min, `${label}: informe ao menos ${min} caracteres.`)
    .required(`${label} é obrigatório.`);
export function validDate(value: string) {
  const parts = value.split("/").map(Number);
  if (parts.length !== 3) return false;
  const [d, m, y] = parts;
  const date = new Date(y, m - 1, d);
  return (
    y >= 1900 &&
    y <= 2100 &&
    date.getDate() === d &&
    date.getMonth() === m - 1 &&
    date.getFullYear() === y
  );
}
const date = () =>
  required("Data", 10).test(
    "date",
    "Informe uma data válida (DD/MM/AAAA).",
    validDate,
  );
const period = {
  inicio: date(),
  fim: yup
    .string()
    .defined()
    .test("date", "Informe uma data final válida.", (v) => !v || validDate(v))
    .test("order", "A data final deve ser posterior à inicial.", function (v) {
      if (!v || !validDate(v) || !validDate(this.parent.inicio)) return true;
      const parse = (s: string) => s.split("/").reverse().join("");
      return parse(v) >= parse(this.parent.inicio);
    }),
};
export const schema = yup.object({
  nome: required("Nome completo", 3),
  cargo: required("Cargo", 3),
  email: required("E-mail").email("Informe um e-mail válido."),
  cpf: required("CPF").matches(
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    "Preencha os 11 dígitos do CPF.",
  ),
  telefone: required("Telefone").matches(
    /^\(\d{2}\) \d{5}-\d{4}$/,
    "Preencha o telefone com DDD e 9 dígitos.",
  ),
  nascimento: date().test(
    "past",
    "O nascimento não pode estar no futuro.",
    (v) =>
      !validDate(v) ||
      new Date(v.split("/").reverse().join("-") + "T00:00:00") <= new Date(),
  ),
  cidade: required("Cidade/UF"),
  resumo: required("Resumo profissional", 30),
  habilidades: required("Habilidades", 3),
  foto: yup.string().defined(),
  experiencias: yup
    .array()
    .of(
      yup.object({
        empresa: required("Empresa"),
        cargo: required("Cargo"),
        descricao: required("Descrição", 15),
        ...period,
      }),
    )
    .defined(),
  formacoes: yup
    .array()
    .of(
      yup.object({
        instituicao: required("Instituição"),
        curso: required("Curso"),
        ...period,
      }),
    )
    .defined(),
});
export type FormValues = yup.InferType<typeof schema>;
export type Curriculo = FormValues & { id: string; criadoEm: string };
export const defaults: FormValues = {
  nome: "",
  cargo: "",
  email: "",
  cpf: "",
  telefone: "",
  nascimento: "",
  cidade: "",
  resumo: "",
  habilidades: "",
  foto: "/avatar.svg",
  experiencias: [],
  formacoes: [],
};
export const mocks: Curriculo[] = [
  {
    ...defaults,
    id: "ana-silva",
    nome: "Ana Silva",
    cargo: "Designer de produto",
    email: "ana@example.com",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-1234",
    nascimento: "12/05/1996",
    cidade: "São Paulo, SP",
    resumo:
      "Designer de produto com foco em experiências digitais acessíveis. Transformo problemas complexos em interfaces simples e úteis para as pessoas.",
    habilidades: "Figma, UX Research, Design System",
    experiencias: [
      {
        empresa: "Estúdio Horizonte",
        cargo: "Product Designer",
        inicio: "01/03/2022",
        fim: "",
        descricao:
          "Pesquisa com usuários, prototipação e desenvolvimento de sistemas de design.",
      },
    ],
    formacoes: [
      {
        instituicao: "SENAI",
        curso: "Design de interfaces",
        inicio: "01/02/2020",
        fim: "15/12/2021",
      },
    ],
    criadoEm: "2026-10-01T12:00:00Z",
  },
  {
    ...defaults,
    id: "lucas-santos",
    nome: "Lucas Santos",
    cargo: "Desenvolvedor frontend",
    email: "lucas@example.com",
    cpf: "987.654.321-00",
    telefone: "(21) 98888-1234",
    nascimento: "20/08/1998",
    cidade: "Rio de Janeiro, RJ",
    resumo:
      "Desenvolvedor frontend apaixonado por criar aplicações rápidas e responsivas. Experiência com React, TypeScript e colaboração em equipes de produto.",
    habilidades: "React, TypeScript, Next.js",
    experiencias: [],
    formacoes: [],
    criadoEm: "2026-10-02T12:00:00Z",
  },
  {
    ...defaults,
    id: "beatriz-costa",
    nome: "Beatriz Costa",
    cargo: "Analista de marketing",
    email: "beatriz@example.com",
    cpf: "111.222.333-44",
    telefone: "(31) 97777-1234",
    nascimento: "03/11/1997",
    cidade: "Belo Horizonte, MG",
    resumo:
      "Profissional de marketing com experiência em estratégia de conteúdo e campanhas digitais. Conecto marcas e pessoas com criatividade e análise de dados.",
    habilidades: "SEO, Conteúdo, Google Analytics",
    experiencias: [],
    formacoes: [],
    criadoEm: "2026-10-03T12:00:00Z",
  },
];
