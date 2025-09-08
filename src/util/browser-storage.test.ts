import { faker } from '@faker-js/faker/locale/pt_BR'
import { browserLocalStorage, browserSessionStorage } from './browser-storage'

describe('localStorage', () => {
  const token = {
    name: 'token',
    value: faker.database.mongodbObjectId(),
  }

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should set variable', () => {
    browserLocalStorage.set({ key: token.name, value: token.value })

    expect(window.localStorage.getItem(token.name)).toBe(token.value)
  })

  it('should get variable', () => {
    window.localStorage.setItem(token.name, token.value)
    const result = browserLocalStorage.get(token.name)

    expect(result).toBe(token.value)
  })

  it('should delete variable', () => {
    window.localStorage.setItem(token.name, token.value)
    browserLocalStorage.delete(token.name)

    expect(window.localStorage.getItem(token.name)).toBeNull()
  })
})

describe('sessionStorage', () => {
  const token = {
    name: 'token',
    value: faker.database.mongodbObjectId(),
  }

  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('should set variable', () => {
    browserSessionStorage.set({ key: token.name, value: token.value })

    expect(window.sessionStorage.getItem(token.name)).toBe(token.value)
  })

  it('should get variable', () => {
    window.sessionStorage.setItem(token.name, token.value)
    const result = browserSessionStorage.get(token.name)

    expect(result).toBe(token.value)
  })

  it('should delete variable', () => {
    window.sessionStorage.setItem(token.name, token.value)
    browserSessionStorage.delete(token.name)

    expect(window.sessionStorage.getItem(token.name)).toBeNull()
  })
})
