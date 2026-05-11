import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**"],
  },

  js.configs.recommended,

  {
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",

      globals: {
        ...globals.node,
      },
    },
  },
];