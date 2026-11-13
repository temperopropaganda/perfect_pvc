import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import checkFile from "eslint-plugin-check-file";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const SRC_EXTENSIONS = "**/*.{ts,tsx}";

const layerElements = [
  { type: "ui", pattern: "src/components/ui/**" },
  { type: "atoms", pattern: "src/components/atoms/**" },
  { type: "molecules", pattern: "src/components/molecules/**" },
  { type: "organisms", pattern: "src/components/organisms/**" },
  { type: "templates", pattern: "src/components/templates/**" },
  { type: "pages", pattern: "src/pages/**" },
  { type: "contexts", pattern: "src/contexts/**" },
  { type: "application", pattern: "src/application/**" },
  { type: "domain", pattern: "src/domain/**" },
  { type: "infrastructure", pattern: "src/infrastructure/**" },
  { type: "lib", pattern: "src/lib/**" },
  { type: "app", pattern: "src/{App,main}.tsx" },
];

// Quem cada camada pode importar. Qualquer outra dependência é erro.
const allowedImports = [
  { from: "atoms", allow: ["lib"] },
  { from: "molecules", allow: ["atoms", "lib"] },
  { from: "organisms", allow: ["molecules", "atoms", "lib"] },
  { from: "templates", allow: ["organisms", "molecules", "atoms", "lib"] },
  { from: "ui", allow: ["lib"] },
  {
    from: "pages",
    allow: [
      "templates",
      "organisms",
      "molecules",
      "atoms",
      "ui",
      "contexts",
      "application",
      "domain",
      "lib",
    ],
  },
  { from: "contexts", allow: ["application", "domain", "lib"] },
  { from: "application", allow: ["domain", "lib"] },
  { from: "infrastructure", allow: ["domain", "application", "lib"] },
  { from: "domain", allow: [] },
  { from: "lib", allow: [] },
  { from: "app", allow: ["pages", "contexts", "infrastructure", "application", "domain", "lib", "ui", "atoms", "molecules", "organisms", "templates"] },
];

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },

  {
    files: [SRC_EXTENSIONS],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "check-file": checkFile,
      boundaries,
    },
    settings: {
      "boundaries/elements": layerElements,
      "boundaries/include": ["src/**/*.{ts,tsx}"],
      // Resolve o alias @src para arquivos reais; sem isso o plugin não vê os imports.
      "import/resolver": {
        typescript: { project: ["tsconfig.app.json"] },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Arrow function por padrão. Contextos são a única exceção (veja o override abaixo).
      "func-style": ["error", "expression", { allowArrowFunctions: true }],

      // Imports internos sempre pelo alias @src.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "./*"],
              message: "Use o alias @src/... em vez de imports relativos.",
            },
          ],
        },
      ],

      // Nomes de arquivos por pasta.
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/application/hooks/*.{ts,tsx}": "CAMEL_CASE",
          "src/application/services/*.{ts,tsx}": "KEBAB_CASE",
          "src/contexts/*.{ts,tsx}": "PASCAL_CASE",
          "src/domain/types/*.{ts,tsx}": "KEBAB_CASE",
          "src/domain/enums/*.{ts,tsx}": "KEBAB_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],

      // Pastas de componentes e páginas em PascalCase.
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/components/atoms/*/": "PASCAL_CASE",
          "src/components/molecules/*/": "PASCAL_CASE",
          "src/components/organisms/*/": "PASCAL_CASE",
          "src/components/templates/*/": "PASCAL_CASE",
          "src/pages/*/": "PASCAL_CASE",
        },
      ],

      // Camadas: as dependências só apontam para dentro.
      "boundaries/element-types": [
        "error",
        { default: "disallow", rules: allowedImports },
      ],
    },
  },

  // Contextos podem usar `export function`.
  {
    files: ["src/contexts/**/*.{ts,tsx}"],
    rules: {
      "func-style": "off",
    },
  },

  // Código gerado pelo shadcn: mantém os nomes e o estilo que o gerador produz.
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "func-style": "off",
      "check-file/filename-naming-convention": "off",
      "check-file/folder-naming-convention": "off",
      "react-refresh/only-export-components": "off",
    },
  },

  // Configurações do próprio projeto usam Node.
  {
    files: ["*.config.{js,ts}", "eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "func-style": "off",
    },
  },

  // Desliga regras que conflitam com o Prettier. Precisa ficar por último.
  prettier,
);
