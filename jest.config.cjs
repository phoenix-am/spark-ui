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
    '^@spark-ui/icons$': '<rootDir>/packages/icons/index.ts',
    '^@spark-ui/(.*)$': '<rootDir>/packages/$1/src',
  },
};
