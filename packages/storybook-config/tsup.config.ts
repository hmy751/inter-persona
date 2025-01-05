import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ["main.ts", "preview.tsx", "util.ts"],
  format: ["cjs", "esm"],
  dts: false,
  clean: true,
  outDir: "dist",
});
