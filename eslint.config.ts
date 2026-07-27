import baseConfig from "./base";
import reactConfig from "./react";

export default [
  { ignores: ["dist", "src/@types/*"] },
  {
    files: ["src/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: ".",
              message: "Use absolute imports instead.",
            },
          ],
        },
      ],
    },
  },
  ...baseConfig,
  ...reactConfig,
  {
    files: ["src/routes/**/*.tsx", "src/utils/router.ts"],
    rules: {
      "@typescript-eslint/only-throw-error": "off",
      "react-refresh/only-export-components": "off",
    },
  },
];