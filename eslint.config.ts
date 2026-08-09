import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import baseConfig from "./base";

export default [
  {
    ignores: [
      "dist",
      "src/@types/*",
      "react.ts",
      "src/integrations/tanstack-query/root-provider.tsx",
    ],
  },
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

  // originally react.ts:
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "19",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Enforces consistent use of JSX boolean values (e.g. `isDisabled` over `isDisabled={true}`)
      "react/jsx-boolean-value": ["warn", "never"],

      // Warns if unnecessary curly braces are present in JSX props or children (e.g. `<Component prop='foo' />` over `<Component prop={'foo'} />`)
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],

      // Enforces PascalCase for user-defined JSX components (e.g. `<MyComponent />` over `<myComponent />`)
      "react/jsx-pascal-case": ["error", { ignore: [] }],

      // Disables the requirement to have React in JSX scope
      "react/react-in-jsx-scope": "off",

      // Rules to disable
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "react/prop-types": 0,
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "off",

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },

  {
    files: ["src/routes/**/*.tsx", "src/utils/router.ts"],
    rules: {
      "@typescript-eslint/only-throw-error": "off",
      "react-refresh/only-export-components": "off",
    },
  },
];