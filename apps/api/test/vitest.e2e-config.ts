import { resolve } from 'node:path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

const srcDir = resolve(process.cwd(), 'src')

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        target: 'es2023',
      },
      module: {
        type: 'es6',
      },
    }),
  ],
  resolve: {
    alias: {
      '#': srcDir,
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/e2e.*.ts'],
    setupFiles: ['test/vitest.e2e-setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
    sequence: {
      shuffle: false,
    },
  },
})
