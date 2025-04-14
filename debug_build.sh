#!/bin/bash

echo "--- Running Debug Script ---"

echo "[DEBUG] Listing root directory contents:"
ls -la

echo "[DEBUG] Listing packages directory contents:"
ls -la packages/ || echo "[DEBUG] packages/ directory not found or error listing."

echo "[DEBUG] Listing typescript-config directory contents:"
ls -la packages/typescript-config/ || echo "[DEBUG] packages/typescript-config/ directory not found or error listing."

echo "[DEBUG] Checking if nextjs.json exists:"
if [ -f "packages/typescript-config/nextjs.json" ]; then
  echo "[DEBUG] FOUND: packages/typescript-config/nextjs.json"
else
  echo "[DEBUG] NOT FOUND: packages/typescript-config/nextjs.json"
fi

echo "[DEBUG] Displaying frontend tsconfig.json:"
if [ -f "apps/frontend/tsconfig.json" ]; then
  cat apps/frontend/tsconfig.json
else
  echo "[DEBUG] apps/frontend/tsconfig.json not found."
fi

echo "[DEBUG] Checking frontend node_modules/@repo structure:"
ls -la apps/frontend/node_modules/@repo/ || echo "[DEBUG] apps/frontend/node_modules/@repo/ directory not found or error listing."

echo "[DEBUG] Checking frontend node_modules/.pnpm structure (related to @repo/typescript-config):"
ls -la apps/frontend/node_modules/.pnpm | grep typescript-config || echo "[DEBUG] No typescript-config found in apps/frontend/node_modules/.pnpm"

echo "--- Debug Script Finished ---" 