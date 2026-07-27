import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

// Custom rule to disallow React.FC and FC for typing components
const noReactFcRule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Disallow React.FC and FC for typing React components",
            category: "Best Practices",
        },
        schema: [],
        messages: {
            noReactFc:
                "Avoid using '{{name}}' to type React components. It implicitly includes 'children' in all props, hides the return type, and makes generics awkward. Prefer inline prop typing: `const MyComponent = ({ foo }: MyComponentPropsType) => ...`.",
        },
    },
    // @ts-ignore
    create(context) {
        const forbiddenNames = new Set([
            "FC",
            "VFC",
            "FunctionComponent",
            "VoidFunctionComponent",
        ]);

        // @ts-ignore
        const reportIfForbidden = (node, typeName) => {
            if (forbiddenNames.has(typeName)) {
                context.report({
                    node,
                    messageId: "noReactFc",
                    data: { name: typeName },
                });
            }
        };

        return {
            // Catches: const Foo: FC = ... or const Foo: React.FC = ...
            // @ts-ignore
            TSTypeReference(node) {
                const { typeName } = node;
                if (typeName.type === "Identifier") {
                    reportIfForbidden(node, typeName.name);
                } else if (
                    typeName.type === "TSQualifiedName" &&
                    typeName.left.name === "React"
                ) {
                    reportIfForbidden(node, typeName.right.name);
                }
            },
        };
    },
};

export default [
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "no-react-fc": {
                rules: {
                    "no-react-fc": noReactFcRule,
                },
            },
        },
        settings: {
            react: {
                version: "19",
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            // Disallow React.FC / FC / FunctionComponent for typing components
            "no-react-fc/no-react-fc": "error",

            // Warn when console statements are used in the codebase (should be done in logger)
            "no-console": "warn",

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
];
