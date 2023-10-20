import { defineConfig } from "tsup";

export default defineConfig({
  splitting: true,
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  format: ["cjs", "esm"], // generate cjs and esm files
  bundle: true,
  skipNodeModulesBundle: true,
  target: "es2020",
  outDir: "dist",
  entry: ["src/index.ts"], //include all files under src
});
