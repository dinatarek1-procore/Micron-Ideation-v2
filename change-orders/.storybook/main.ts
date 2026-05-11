import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Configuration, RuleSetRule } from 'webpack';
import webpack from 'webpack';

const require = createRequire(import.meta.url);

const scaffoldRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

/** Merge json-toolinator + error-pages into one chunk (avoids ChunkLoadError in Storybook iframe). */
function mergeJsonToolinatorChunks(webpackConfig: Configuration): void {
  const opt = webpackConfig.optimization ?? {};
  const splitChunks = opt.splitChunks;
  const existingCacheGroups =
    splitChunks &&
    typeof splitChunks === 'object' &&
    'cacheGroups' in splitChunks &&
    splitChunks.cacheGroups
      ? splitChunks.cacheGroups
      : {};
  webpackConfig.optimization = {
    ...opt,
    splitChunks: {
      ...splitChunks,
      cacheGroups: {
        ...existingCacheGroups,
        jsonToolinator: {
          test: /[/\\](?:node_modules[/\\]@procore[/\\](?:json-toolinator|error-pages)|packages[/\\]core[/\\]src)[/\\]/,
          name: 'json-toolinator',
          chunks: 'all',
          enforce: true,
          priority: 50,
        },
      },
    },
  };
}

function insertPostcssForCss(config: Configuration): void {
  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        config: path.join(scaffoldRoot, 'postcss.config.cjs'),
      },
    },
  };

  const patchUse = (use: unknown): void => {
    if (!Array.isArray(use)) return;
    const loaders = use as Array<{ loader?: string } | string>;
    if (
      loaders.some(
        (u) =>
          typeof u === 'object' &&
          u &&
          'loader' in u &&
          String(u.loader).includes('postcss-loader')
      )
    ) {
      return;
    }
    const cssIdx = loaders.findIndex(
      (u) =>
        typeof u === 'object' &&
        u &&
        'loader' in u &&
        String(u.loader).includes('css-loader')
    );
    // Webpack applies `use` right-to-left; postcss must run first on raw `.css`, so it must sit
    // after css-loader in the array (higher index than css-loader).
    if (cssIdx >= 0) {
      loaders.splice(cssIdx + 1, 0, postcssLoader);
    }
  };

  const walk = (rules: RuleSetRule[] | undefined): void => {
    if (!rules) return;
    for (const rule of rules) {
      if (typeof rule !== 'object' || !rule) continue;
      if ('oneOf' in rule && Array.isArray(rule.oneOf)) {
        walk(rule.oneOf as RuleSetRule[]);
      }
      if ('rules' in rule && Array.isArray(rule.rules)) {
        walk(rule.rules as RuleSetRule[]);
      }
      if (
        'test' in rule &&
        rule.test &&
        String(rule.test) === String(/\.css$/) &&
        'use' in rule
      ) {
        patchUse((rule as { use?: unknown }).use);
      }
    }
  };

  config.module = config.module ?? {};
  walk(config.module.rules as RuleSetRule[] | undefined);
}

function applyScaffoldWebpackEnrichments(config: Configuration): Configuration {
  config.module = config.module ?? {};
  config.module.parser = {
    ...config.module.parser,
    javascript: {
      ...(config.module.parser as { javascript?: object } | undefined)
        ?.javascript,
      // Align with hammer.config: TanStack Router uses `React['use']` for optional React 19 APIs.
      importExportsPresence: false,
    },
  };

  config.resolve = config.resolve ?? {};
  config.resolve.alias = {
    ...(config.resolve.alias as Record<string, string | false | string[]>),
    '@': path.join(scaffoldRoot, 'src'),
  };
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    process: require.resolve('process/browser'),
  };
  config.resolve.extensionAlias = {
    ...config.resolve.extensionAlias,
    '.js': ['.ts', '.tsx', '.js'],
    '.mjs': ['.mts', '.mjs'],
  };

  config.module = config.module ?? {};
  const rules = config.module.rules ?? [];
  config.module.rules = [
    {
      test: /\.m?js$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    },
    {
      test: /\.svg$/i,
      type: 'asset/resource',
    },
    ...rules,
  ];

  const toastAlertWarnings = {
    module: /[/\\]node_modules[/\\]@procore[/\\]toast-alert[/\\]/,
  };
  const existingIgnore = config.ignoreWarnings;
  config.ignoreWarnings = [
    ...(Array.isArray(existingIgnore)
      ? existingIgnore
      : existingIgnore
        ? [existingIgnore]
        : []),
    toastAlertWarnings,
  ];

  config.plugins = config.plugins ?? [];
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser'),
      React: require.resolve('react'),
    })
  );

  insertPostcssForCss(config);

  return config;
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-webpack5',
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@procore/storybook-addon',
  ],
  /** json-toolinator uses `URL.parse(document.baseURI).pathname` as router basepath — default iframe path is `/iframe.html`. */
  previewHead: (head) => `<base href="/" />\n${head}`,
  webpackFinal: async (webpackConfig) => {
    const cfg = webpackConfig as Configuration;
    mergeJsonToolinatorChunks(cfg);
    const out = applyScaffoldWebpackEnrichments(cfg);
    const prevDevServer = out.devServer ?? {};
    const prevHeaders =
      typeof prevDevServer.headers === 'object' &&
      prevDevServer.headers !== null &&
      !Array.isArray(prevDevServer.headers)
        ? prevDevServer.headers
        : {};
    out.devServer = {
      ...prevDevServer,
      headers: {
        ...prevHeaders,
        'Content-Security-Policy':
          "frame-ancestors 'self' http://localhost:3000 http://127.0.0.1:3000 http://localhost:6030 http://127.0.0.1:6030;",
      },
    };
    return out;
  },
};

export default config;
