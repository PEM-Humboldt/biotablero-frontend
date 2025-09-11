/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_TRACKING_ID: string; // 👈 tipamos la variable
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
