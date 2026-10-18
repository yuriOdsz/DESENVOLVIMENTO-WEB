import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sistema/paginas/curriculos",
        destination: "/curriculos/visualizar",
        permanent: true,
      },
      {
        source: "/sistema/paginas/curriculos/novo",
        destination: "/curriculos/cadastrar",
        permanent: true,
      },
      {
        source: "/sistema/paginas/curriculos/:id",
        destination: "/curriculos/visualizar/:id",
        permanent: true,
      },
    ];
  },
};
export default config;
