import { renderHook } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { cookiesStorage } from '@/util/browser-storage'
import { updateUserProfile } from './update-user-profile'

describe('updateUserProfile', () => {
  const testFile = new File(['(dummy content)'], 'avatar.png', {
    type: 'image/png',
  })
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const SpyCookiesStorageGet = jest.spyOn(cookiesStorage, 'get')
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    id: faker.database.mongodbObjectId(),
    avatar: faker.image.avatar(),
    createAt: faker.date.past().toISOString(),
  }

  beforeEach(() => {
    SpyCookiesStorageGet.mockReturnValue(jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onPatch('/users/update').replyOnce(200, { user })
    const { result } = renderHook(() =>
      updateUserProfile({
        file: testFile,
        name: user.name,
      })
    )

    expect(await result.current).toMatchObject({ user })
    expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
      `Bearer ${jwtToken}`
    )
  })

  it('should handle error when user not have token to authorization', async () => {
    SpyCookiesStorageGet.mockReset()
    MockAxiosBackApi.onPatch('/users/update').replyOnce(200, { user })
    const { result } = renderHook(() =>
      updateUserProfile({
        file: testFile,
        name: user.name,
      })
    )

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(0)
    expect(SpyConsole).toHaveBeenCalled()
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onPatch('/users/update').replyOnce(500, undefined)
    const { result } = renderHook(() =>
      updateUserProfile({
        file: testFile,
        name: user.name,
      })
    )

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })

  it('should handle empty response when fetching user data', async () => {
    MockAxiosBackApi.onPatch('/users/update').replyOnce(200, undefined)
    const { result } = renderHook(() =>
      updateUserProfile({
        file: testFile,
        name: user.name,
      })
    )

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })
})
