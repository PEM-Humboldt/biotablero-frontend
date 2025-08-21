import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  server: {
    port: 3000,
  },
  // NOTE: por legacy con CRA mantenemos 'build', vite por default utiliza 'dist'
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  // HACK: mientras la migración de componentes, hacemos explícita la declaración
  // de variables que CRA hacía bajo cuerda para los polifils
  define: {
    global: "window",
    "process.env": {},
  },
  optimizeDeps: {
    include: [],
    // HACK: Mientras se hace la actualización de dependencias, para evitar
    // que la consola se inunde con warnings sobre sourcemaps de las librerias
    esbuildOptions: {
      sourcemap: false,
    },
  },
});
