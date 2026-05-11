/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^ckeditor5$': '<rootDir>/test/ckeditor5Mock.cjs',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/test/fileMock.cjs',
    '^(\\.{1,2}/.+)\\.js$': '$1',
  },
  setupFiles: ['<rootDir>/jest.mocks.cjs'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
    '^.+/node_modules/(?:(?:@procore|@tanstack|@react-dnd)/.+|date-fns/.+|react-resize-detector/.+)\\.(js|mjs)$':
      [
        'ts-jest',
        {
          tsconfig: {
            allowJs: true,
            jsx: 'react-jsx',
            module: 'commonjs',
            target: 'ES2020',
            esModuleInterop: true,
            isolatedModules: true,
            skipLibCheck: true,
          },
          diagnostics: { warnOnly: true },
        },
      ],
  },
  transformIgnorePatterns: [
    // Smart Grid bundles react-dnd under @procore/smart-grid-core/node_modules (ESM).
    // engagement-emails → @procore/data-table → react-resize-detector (ESM).
    '/node_modules/(?!(@procore|@tanstack|date-fns|react-dnd|react-dnd-html5-backend|dnd-core|@react-dnd|react-resize-detector)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testTimeout: 60000,
};
