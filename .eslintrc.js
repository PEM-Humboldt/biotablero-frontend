module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": "off", // Not needed for React 17+
    "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }], // permite JSX en .tsx
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
        js: "never",
        jsx: "never",
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.spec.ts",
          "**/*.spec.tsx",
          "vite.config.ts",
        ],
      },
    ],

    "no-nested-ternary": "error", // No permitir operadores ternarios anidados
    curly: "error", // Obligar uso de llaves en bloques de control
    "brace-style": ["error", "1tbs", { allowSingleLine: false }], // Estilo de llaves
    "import/no-default-export": "error", // No permitir exportaciones default
    // No permitir importaciones default desde src/, pero sí desde node_modules
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["./src/**", "../src/**", "../../src/**", "src/**"],
            importNames: ["default"],
            message:
              "No se permiten importaciones default desde la carpeta src. Usa named imports.",
          },
        ],
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect",
    },
  },
};
