module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks", "import"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function",
      },
    ],

    "import/no-cycle": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      { ts: "never", tsx: "never", js: "never", jsx: "never" },
    ],
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",
    "import/no-relative-parent-imports": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.{ts,tsx}",
          "**/*.spec.{ts,tsx}",
          "vite.config.ts",
          "jest.config.{js,ts}",
        ],
      },
    ],

    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/quotes": "off",

    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "prefer-arrow-callback": [
      "error",
      { allowNamedFunctions: true, allowUnboundThis: true },
    ],
    "no-nested-ternary": "error",
    curly: "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-var": "error",
    "prefer-const": "error",
  },

  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },

  overrides: [
    {
      files: ["vite.config.ts", "*.config.js"],
      rules: { "import/no-default-export": "off" },
    },
  ],
};
