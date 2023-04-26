import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/util/apollo/client.ts",
  documents: ["src/**/!(*.tests).tsx", "src/**/!(*.tests).ts"],
  generates: {
    "./src/util/apollo/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
