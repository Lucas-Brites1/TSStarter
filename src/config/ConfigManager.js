class ConfigManager {
  packageJsonConfig = {
    build: "tsc",
    dev: "ts-node ./src/index.ts",
    start: "node ./dist/index.js",
  };

  tsconfigJSONConfig = {
    compilerOptions: {
      target: "ES2020",
      module: "commonjs",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      outDir: "./dist",
      rootDir: "./src"
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"]
  };

}

const configManager = new ConfigManager();
export { configManager };
