import baseConfig from "./base";
import reactConfig from "./react";

export default [
  { ignores: ["dist", "src/@types/*", "react.ts", "src/integrations/tanstack-query/root-provider.tsx"] },
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
      "no-console": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
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