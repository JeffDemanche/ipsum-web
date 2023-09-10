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
    "./src/util/apollo/__generated__/apollo-helpers.ts": {
      plugins: ["typescript-apollo-client-helpers"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
