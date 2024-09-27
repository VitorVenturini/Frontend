import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";
import os from "os"; 

// Verifica se o hostname é diferente de 'localhost'
const isLocalhost = os.hostname() === "localhost" || os.hostname().startsWith("127.0.0.1");

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
          port: 4343, // define a porta desejada
          hmr: {
            overlay: false, // Desabilita o overlay de erros
          },
        },
      }),
});
