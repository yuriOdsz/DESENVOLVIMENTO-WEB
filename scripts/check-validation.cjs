const fs = require("node:fs");
const ts = require("typescript");
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");
const filename = path.resolve("src/lib/curriculos.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = module.paths;
loaded._compile(compiled, filename);
const { schema, mocks, validDate } = loaded.exports;
async function main() {
  for (const item of mocks) await schema.validate(item, { abortEarly: false });
  assert.equal(validDate("29/02/2024"), true);
  assert.equal(validDate("29/02/2025"), false);
  assert.equal(validDate("31/04/2025"), false);
  const valid = mocks[0];
  for (const [key, value] of Object.entries({
    nome: "",
    email: "invalido",
    cpf: "123",
    telefone: "123",
    nascimento: "31/02/2020",
    resumo: "curto",
  })) {
    await assert.rejects(schema.validate({ ...valid, [key]: value }));
  }
  await assert.rejects(
    schema.validate(
      {
        ...valid,
        experiencias: [
          {
            empresa: "",
            cargo: "",
            inicio: "01/01/2025",
            fim: "01/01/2024",
            descricao: "curto",
          },
        ],
      },
      { abortEarly: false },
    ),
  );
  await assert.rejects(
    schema.validate({
      ...valid,
      formacoes: [
        { instituicao: "", curso: "", inicio: "32/13/2025", fim: "" },
      ],
    }),
  );
  await schema.validate({ ...valid, experiencias: [], formacoes: [] });
  console.log(
    "Validação OK: exemplos, obrigatórios, e-mail, máscaras, calendário, períodos e arrays.",
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
