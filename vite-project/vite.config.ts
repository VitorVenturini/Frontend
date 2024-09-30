import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const isLocalhost = process.env.VITE_HOSTNAME === "localhost";
const hostPort = Number(process.env.HOST_PORT) || 3000;  

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ...(isLocalhost
    ? {} // Se for localhost, não aplica HTTPS
    : {
        server: {
          https: {
            key: fs.readFileSync(
              path.resolve(__dirname, "/home/wecom/wecom.com.br.key")
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, "/home/wecom/wecom.com.br.pem")
            ),
          },
          host: "0.0.0.0", // para permitir acesso externo
          port: hostPort, // define a porta desejada
          hmr: {
            overlay: false, // Desabilita o overlay de erros
          },
        },
      }),
});
