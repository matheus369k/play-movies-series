import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  browserLocalStorage,
  browserSessionStorage,
  cookiesStorage,
} from './browser-storage'

describe('cookiesStorage', () => {
  const cookieExpired = faker.date.past().toISOString()
  const token = {
    name: 'token',
    value: faker.database.mongodbObjectId(),
  }

  beforeEach(() => {
    document.cookie = ''
  })

  it('should set cookie', () => {
    cookiesStorage.set({ key: token.name, value: token.value })

    expect(document.cookie.includes(token.name)).toBeTruthy()
    expect(document.cookie.includes(token.value)).toBeTruthy()
  })

  it('should set cookie when is many cookies', () => {
    document.cookie = `${token.name}=${token.value};expires=${cookieExpired}`
    cookiesStorage.set({ key: 'user', value: 'matheus' })

    expect(document.cookie.includes('user')).toBeTruthy()
    expect(document.cookie.includes('matheus')).toBeTruthy()
    expect(document.cookie.includes(token.name)).toBeTruthy()
    expect(document.cookie.includes(token.value)).toBeTruthy()
  })

  it('should get cookie', () => {
    document.cookie = `${token.name}=${token.value};expires=${cookieExpired}`
    expect(document.cookie.includes(token.name)).toBeTruthy()

    const cookie = cookiesStorage.get(token.name)
    expect(cookie).toBe(token.value)
  })

  it('should get single cookie when is many cookies in the storage', () => {
    document.cookie = `${token.name}=${token.value};expires=${cookieExpired}`
    document.cookie = `user=matheus;expires=${cookieExpired}`
    expect(document.cookie.includes(token.name)).toBeTruthy()

    const cookie = cookiesStorage.get(token.name)
    expect(cookie).toBe(token.value)
  })
})

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
