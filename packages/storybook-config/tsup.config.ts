import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ["main.ts", "preview.tsx", "util.ts", "src/**/*.ts", "src/**/*.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  external: [
    "@repo/ui/styles/globals.css"
  ],
});
