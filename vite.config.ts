import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativo ("./") no build para a UI funcionar em subcaminho — ex.: GitHub
// Pages serve em https://<user>.github.io/Label-Sim/. No dev, base absoluto ("/").
export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  plugins: [react()],
  build: {
    outDir: "dist-ui",
    emptyOutDir: true,
  },
}));
