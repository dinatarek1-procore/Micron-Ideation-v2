import { createRequire } from 'node:module';
import { defineConfig } from '@procore/hammer';
import '@procore/hammer-app-webpack';
import '@procore/hammer-test-jest';
import webpack from 'webpack';

const require = createRequire(import.meta.url);

/**
 * Procore prototype scaffold: Hammer drives webpack (dev/build).
 * Global nav uses @tanstack/react-router (hash) in shellHeaderRouter — no next/router shim.
 */
export default defineConfig({
  app: {
    entry: { index: 'bootstrap' },
    webpackOverride: {
      resolve: {
        // TypeScript sources use `.js` in import specifiers (Node ESM style); map back to `.ts`/`.tsx`.
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js'],
          '.mjs': ['.mts', '.mjs'],
        },
        // Match .storybook/main.ts: some @procore bundles pull Node streams/crypto shims that expect `process` / `path`.
        fallback: {
          process: require.resolve('process/browser'),
          path: require.resolve('path-browserify'),
        },
      },
      // @tanstack/react-router reads `React['use']` for optional React 19 APIs; webpack would otherwise
      // emit a static `use` import that React 18 does not export.
      module: {
        parser: {
          javascript: {
            importExportsPresence: false,
          },
        },
      },
      devServer: {
        port: 3001,
        historyApiFallback: true,
      },
      ignoreWarnings: [
        {
          module: /[/\\]node_modules[/\\]@procore[/\\]toast-alert[/\\]/,
        },
      ],
      plugins: [
        new webpack.ProvidePlugin({
          // Hammer/babel + styled-components can emit classic `React.createElement`; avoid per-file imports.
          React: 'react',
          process: require.resolve('process/browser'),
        }),
      ],
    },
  },
});
