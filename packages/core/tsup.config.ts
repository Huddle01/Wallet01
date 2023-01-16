import { defineConfig } from "tsup";

export default defineConfig({
  splitting: true,
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  format: ["cjs", "esm"], // generate cjs and esm files
  bundle: true,
  skipNodeModulesBundle: true,
  entryPoints: ["src/index.ts"],
  target: "es2020",
  outDir: "dist",
  entry: ["src/**/*.ts"], //include all files under src
});
