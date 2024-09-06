import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, '/home/wecom/wecom.com.br.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, '/home/wecom/wecom.com.br.pem')),
  //   },
  //   host: '0.0.0.0', // para permitir acesso externo, se necessário
  //   port: 443, // você pode definir a porta desejada
  //   hmr: {
  //     overlay: false, // Desabilita o overlay de erros
  //   },
  // },
})
