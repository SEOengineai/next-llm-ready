import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

export default defineConfig([
  // Main entry (components)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'next'],
    treeshake: true,
    splitting: false,
    minify: false,
    outDir: 'dist',
    onSuccess: async () => {
      // Copy CSS file to dist
      const srcPath = join(process.cwd(), 'src/styles/llm-ready.css');
      const destPath = join(process.cwd(), 'dist/styles.css');
      try {
        mkdirSync(dirname(destPath), { recursive: true });
        copyFileSync(srcPath, destPath);
        console.log('Copied styles.css to dist/');
      } catch (err) {
        console.error('Failed to copy CSS:', err);
      }
    },
  },
  // Hooks entry
  {
    entry: ['src/hooks/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom', 'next'],
    treeshake: true,
    outDir: 'dist/hooks',
  },
  // Server utilities entry
  {
    entry: ['src/server/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom', 'next'],
    treeshake: true,
    outDir: 'dist/server',
  },
  // API handlers entry
  {
    entry: ['src/api/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom', 'next'],
    treeshake: true,
    outDir: 'dist/api',
  },
]);
