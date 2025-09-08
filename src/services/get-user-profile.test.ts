import { renderHook } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { getUserProfile } from './get-user-profile'
import cookies from 'js-cookie'
import { JWT_USER_TOKEN } from '@/util/consts'

describe('getUserProfile', () => {
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    id: faker.database.mongodbObjectId(),
    avatar: faker.image.avatar(),
    createAt: faker.date.past().toISOString(),
  }

  beforeEach(() => {
    cookies.set(JWT_USER_TOKEN, jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onGet('/users/profile').replyOnce(200, { user })
    const { result } = renderHook(getUserProfile)

    expect(await result.current).toMatchObject({ user })
    expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
      `Bearer ${jwtToken}`
    )
  })

  it('should handle error when user not have token to authorization', async () => {
    cookies.remove(JWT_USER_TOKEN)
    MockAxiosBackApi.onGet('/users/profile').replyOnce(200, { user })
    const { result } = renderHook(getUserProfile)

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(0)
    expect(SpyConsole).toHaveBeenCalled()
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onGet('/watch-later').replyOnce(500, undefined)
    const { result } = renderHook(getUserProfile)

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })

  it('should handle empty response when fetching user profile data', async () => {
    const SpyConsole = jest.spyOn(console, 'log')
    MockAxiosBackApi.onGet('/users/profile').replyOnce(200, undefined)

    const { result } = renderHook(getUserProfile)

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })
})
