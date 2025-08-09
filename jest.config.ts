import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  rootDir: '.',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/util/jestSetup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
}

export default config
