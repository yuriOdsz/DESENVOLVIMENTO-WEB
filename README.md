# Curricula — Gestão de Currículos

Projeto acadêmico para a Etapa 1 (Frontend) do SENAI. Landing page, busca de talentos, detalhes, criação, edição e exclusão de currículos com persistência no navegador.

## Executar

Requisitos: Node.js 20.9 ou superior e npm.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. Para produção: `npm run build` e `npm start`. Verificação de tipos: `npm run typecheck`.

## Stack e organização

- Next.js 15 com App Router e TypeScript; Tailwind CSS 4.
- Componentes locais shadcn/ui: Button (Radix Slot/CVA), Card e Skeleton, configurados em components.json.
- React Hook Form, useFieldArray, Yup e resolvers: validação de campos e de cada experiência/formação.
- React Input Mask Next: CPF, telefone e datas; Sonner: feedback; SweetAlert2: confirmação de exclusão, carregada sob demanda.
- Como a versão exigida de React Input Mask Next usa `findDOMNode` (removido no React 19), o script `postinstall` aplica uma correção restrita às referências de inputs nativos. A versão está fixada; não use componentes filhos customizados nessa biblioteca sem rever a correção.
- Lucide React, Next Image e imagens em public. Foto inicial local; upload fake com FileReader, redimensionamento e persistência como data URL, sem servidor de arquivos.
- Formulário carregado com next/dynamic; dados locais e detalhes usam carregamento simulado com Skeleton.

`src/app` contém rotas; `src/components` contém interface, formulário e contexto; `src/components/ui` contém primitivas; `src/lib` contém esquema, tipos e exemplos.

## Rotas

| Página        | Endereço                            |
| ------------- | ----------------------------------- |
| Início        | `/`                                 |
| Lista e busca | `/curriculos/visualizar`            |
| Perfil        | `/curriculos/visualizar/[id]`       |
| Cadastro      | `/curriculos/cadastrar`             |
| Edição        | `/curriculos/cadastrar?editar=[id]` |

As rotas antigas `/sistema/paginas/curriculos`, `/sistema/paginas/curriculos/novo` e `/sistema/paginas/curriculos/[id]` redirecionam para os endereços amigáveis. Ocultar caminhos não equivale a autenticação: esta etapa é uma demonstração local, sem controle de acesso real. Uma etapa backend deve implementar autenticação e autorização antes de usar dados pessoais reais.

## Comportamentos e validação manual

1. Acesse a lista: três exemplos fictícios são criados apenas no primeiro acesso.
2. Busque por nome ou cargo (busca ignora acentos e maiúsculas); confira resultado vazio e limpeza da busca.
3. Cadastre um currículo: obrigatórios, e-mail, mínimos de texto, datas reais e ordem dos períodos são validados. Clique em “Verificar campos pendentes” para obter erros específicos também no Sonner. Salvar fica desabilitado enquanto o formulário estiver inválido ou enviando.
4. Adicione e remova várias experiências e formações; itens adicionados são validados individualmente. Arrays vazios permitem candidatos sem experiência/formação.
5. Escolha uma imagem JPG, PNG ou WebP de até 2 MB; confira prévia e feedback de upload simulado.
6. Salve, abra detalhes, edite e recarregue o navegador para verificar persistência.
7. Exclua com confirmação; cancelar preserva o currículo. Exclua todos para ver o botão “Criar meu primeiro currículo”.
8. Confira navegação ativa, loading, ID inexistente, página 404 e telas de 375 px, 768 px e desktop.

Os dados ficam na chave `curricula:v1` do localStorage, por origem/navegador. Uma lista vazia permanece vazia ao recarregar. Para restaurar os exemplos, remova essa chave nas ferramentas do navegador. Falhas de armazenamento exibem toast e não confirmam a gravação. Não há sincronização entre dispositivos ou abas.

## Entrega

Verificações executadas: build de produção, TypeScript e `npm test` (regras de validação). A inspeção visual e os fluxos interativos no navegador devem ser conferidos seguindo o roteiro acima; não havia navegador conectado no ambiente de implementação.

O código está preparado para um repositório GitHub. Para criar seu histórico local e enviar a um repositório seu:

```sh
git init
git add .
git commit -m "Implementa etapa frontend do sistema de curriculos"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

Deploy opcional: importe o repositório na Vercel, selecione Next.js e use as configurações padrão. Não são necessárias variáveis de ambiente. GitHub e Vercel precisam de conta e destino definidos pelo responsável pela entrega.
