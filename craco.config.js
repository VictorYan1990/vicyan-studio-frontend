module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.md$/,
        type: 'asset/source',
      });
      return webpackConfig;
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.moduleNameMapper = {
        // react-router-dom v7's "main" field points to a file that doesn't
        // exist; Jest 27 can't read the "exports" field, so point it at the
        // real CJS entry directly.
        '^react-router-dom$': '<rootDir>/node_modules/react-router-dom/dist/index.js',
        '^react-router/dom$': '<rootDir>/node_modules/react-router/dist/development/dom-export.js',
        // react-markdown v8 is ESM-only, which Jest 27 can't parse; tests
        // use a simple stub component instead.
        '^react-markdown$': '<rootDir>/src/__mocks__/react-markdown.tsx',
        ...jestConfig.moduleNameMapper,
      };
      return jestConfig;
    },
  },
};
