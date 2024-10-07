import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node, // Add Node.js globals
        ...globals.browser, // If you also want to include browser globals
        error: "readonly", // Define error as a global variable
      },
    },
  },
  pluginJs.configs.recommended,
];
