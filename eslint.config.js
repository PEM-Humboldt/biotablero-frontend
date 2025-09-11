import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      prettier,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: { alwaysTryTypes: true, project: "./tsconfig.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
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
      "react/require-default-props": "off",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "import/no-cycle": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        { ts: "never", tsx: "never", js: "never", jsx: "never" },
      ],
      "import/no-default-export": "error",
      "import/prefer-default-export": "off",
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
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./", "../"],
              message:
                "Avoid relative imports beyond 1 level, use aliases instead.",
            },
          ],
        },
      ],
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

      ...jsxA11y.configs.recommended.rules,
      "prettier/prettier": "error",
    },
  },

  {
    files: ["eslint.config.js", "vite.config.ts", "*.config.js"],
    languageOptions: {
      parserOptions: { project: null },
    },
    rules: {
      "import/no-default-export": "off",
    },
  },
];
