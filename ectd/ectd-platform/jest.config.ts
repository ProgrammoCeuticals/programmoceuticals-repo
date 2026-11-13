import type { Config } from "jest";

const config: Config = {
  rootDir: ".",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          exactOptionalPropertyTypes: false,
          strict: true,
          esModuleInterop: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          paths: {
            "@ectd/shared": ["./packages/shared/src/index.ts"],
            "@ectd/domain": ["./packages/ectd-domain/src/index.ts"],
            "@ectd/standards": ["./packages/ectd-standards/src/index.ts"],
            "@ectd/ectd-documents": ["./packages/ectd-documents/src/index.ts"],
            "@ectd/ectd-storage": ["./packages/ectd-storage/src/index.ts"],
            "@ectd/ectd-lifecycle": ["./packages/ectd-lifecycle/src/index.ts"],
            "@ectd/ectd-xml": ["./packages/ectd-xml/src/index.ts"],
            "@ectd/validation": ["./packages/ectd-validation/src/index.ts"],
            "@ectd/ectd-publishing": ["./packages/ectd-publishing/src/index.ts"],
          },
        },
      },
    ],
  },
  testMatch: [
    "<rootDir>/tests/**/*.spec.ts",
    "<rootDir>/apps/*/src/**/*.spec.ts",
    "<rootDir>/packages/*/src/**/*.spec.ts",
  ],
  moduleNameMapper: {
    "^@ectd/shared$": "<rootDir>/packages/shared/src/index.ts",
    "^@ectd/standards$": "<rootDir>/packages/ectd-standards/src/index.ts",
    "^@ectd/domain$": "<rootDir>/packages/ectd-domain/src/index.ts",
    "^@ectd/ectd-documents$": "<rootDir>/packages/ectd-documents/src/index.ts",
    "^@ectd/ectd-storage$": "<rootDir>/packages/ectd-storage/src/index.ts",
    "^@ectd/ectd-lifecycle$": "<rootDir>/packages/ectd-lifecycle/src/index.ts",
    "^@ectd/ectd-xml$": "<rootDir>/packages/ectd-xml/src/index.ts",
    "^@ectd/validation$": "<rootDir>/packages/ectd-validation/src/index.ts",
    "^@ectd/ectd-publishing$":
      "<rootDir>/packages/ectd-publishing/src/index.ts",
    "^@ectd/shared/(.*)$": "<rootDir>/packages/shared/src/$1",
    "^@ectd/standards/(.*)$": "<rootDir>/packages/ectd-standards/src/$1",
  },
  collectCoverageFrom: [
    "packages/*/src/**/*.ts",
    "apps/*/src/**/*.ts",
    "!**/*.module.ts",
    "!**/index.ts",
    "!**/*.dto.ts",
    "!**/main.ts",
    "!**/dist/**",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  verbose: true,
};

export default config;
