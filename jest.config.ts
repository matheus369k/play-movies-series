import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  rootDir: '.',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
  ],
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/util/jestSetup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
          baseUrl: '.',
          paths: {
            '@/*': ['src/*'],
          },
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
          },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  testEnvironmentOptions: {
    url: 'http://localhost:3000/play-movies-series',
  },
  testTimeout: 10000,
  maxWorkers: '50%',
}

export default config
