import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr(), tailwind()],
  server: {
    port: 3000,
    proxy: {
      '/realms': {
        target: 'http://192.168.11.44:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/',
        headers: {
          'X-Forwarded-Host': 'localhost:3000',
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/resources': {
        target: 'http://192.168.11.44:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  },
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
