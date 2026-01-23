import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import tailwind from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';
  
  // Solo usar proxy en desarrollo local si Keycloak está en IP interna
  const useProxy = isDevelopment && env.VITE_USE_PROXY === 'true';

  return {
    plugins: [react(), tsconfigPaths(), svgr(), tailwind()],
    
    server: {
      port: 3000,
      // Proxy SOLO en desarrollo local Y SOLO si está habilitado
      // NO se usa en staging ni producción
      ...(useProxy && {
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
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq, req) => {
                console.log('Proxy request:', req.method, req.url);
              });
              proxy.on('proxyRes', (proxyRes, req) => {
                console.log('Proxy response:', proxyRes.statusCode, req.url);
              });
            },
          },
          '/resources': {
            target: 'http://192.168.11.44:8080',
            changeOrigin: true,
            secure: false,
          },
        },
      }),
    },

    build: {
      outDir: "dist",
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'keycloak': ['keycloak-js'],
            'map-vendor': ['leaflet'], 
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    preview: {
      port: 3000,
    },
    define: {
      global: "window",
      "process.env": {},
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '1.0.0'),
      __BUILD_MODE__: JSON.stringify(mode),
    },
    optimizeDeps: {
      include: ['keycloak-js', 'axios'],
      exclude: ["react-router-dom"],
      esbuildOptions: {
        sourcemap: false,
      },
    },
  };
});