import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";
import dotenv from "dotenv";
import vercel from 'vite-plugin-vercel';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const isLocalhost = process.env.VITE_HOSTNAME === "localhost";
const hostPort = Number(process.env.VITE_HOST_PORT) || 3000;  
const keyPath = process.env.KEY_PATH
const pemPath = process.env.PEM_PATH
// https://vite.dev/config/

export default defineConfig({
  plugins: [react(),vercel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  ...(isLocalhost
    ? {} // Se for localhost, não aplica HTTPS
    : {
        server: {
          https: {
            key: fs.readFileSync(
              path.resolve(__dirname, keyPath as string)
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, pemPath as string)
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
