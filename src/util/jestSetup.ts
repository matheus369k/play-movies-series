import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/util/env.ts', () => ({
  env: {
    VITE_API_OMDBAPI: 'https://www.omdbapi.com/',
    VITE_BACKEND_URL: 'http://localhost:3333',
    VITE_API_OMDBAPI_KEY: '12345678',
  },
}))

beforeEach(() => {
  jest.clearAllMocks()
  cleanup()
})
