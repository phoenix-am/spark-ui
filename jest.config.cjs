/** Jest runs the accessibility and behaviour tests in packages/core. */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages/core/src'],
  testMatch: ['**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/styleStub.js',
    '^@sparkwire/icons$': '<rootDir>/packages/icons/index.ts',
    '^@sparkwire/core/(base|headless)$': '<rootDir>/packages/core/src/$1',
    // Blocks are copied into apps by the CLI; demos import them from that path.
    '^@/components/spark-ui/(.*)$': '<rootDir>/packages/core/src/$1',
    '^@sparkwire/(.*)$': '<rootDir>/packages/$1/src',
  },
};
