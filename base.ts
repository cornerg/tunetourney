import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Enforces consistent type definitions (preferring `type` over `interface` for better IDE support)
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      // Enforces naming conventions for different types of variables
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          // Interface names should be PascalCase and prefixed with I
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          // Type alias names should be PascalCase and suffixed with Type
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          // Enum names should be PascalCase and suffixed with Enum
          selector: "enum",
          format: ["PascalCase"],
        },
        {
          // Boolean variable names should be camelCase and prefixed with is, should, has, can, will
          selector: "variable",
          types: ["boolean"],
          filter: {
            regex: "^(is|should|has|can|will|show)",
            match: true,
          },
          format: ["camelCase", "PascalCase"], // the prefix is trimmed before format is validated, therefore PascalCase must be used to allow variables such as `isEnabled` using the prefix `is`
          prefix: ["is", "should", "has", "can", "will", "show"],
        },
      ],
      // Ignore unused variables prefixed with an underscore
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Ensure promises are handled or explicitly ignored with void
      "@typescript-eslint/no-floating-promises": ["warn", { ignoreVoid: true }],
      // Disables the requirement to sort import declarations within module (handled by Prettier)
      "import/order": "off",
      // Allow void as a statement (e.g. `void foo()` is allowed but not `const bar = void foo()`)
      "no-void": ["warn", { allowAsStatement: true }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);
