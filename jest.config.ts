const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      // Actual coverage (2026-03-18): branches 49%, functions 48%, lines 62%, statements 59%
      // Roadmap: current → 60% branches (Q2) → 75% all metrics (Q3) per Engineering Excellence
      branches: 45,
      functions: 45,
      lines: 58,
      statements: 55,
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default config;
