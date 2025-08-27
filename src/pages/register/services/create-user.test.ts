import { renderHook } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { createUser } from './create-user'

describe('createUser', () => {
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const userResponse = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    id: faker.database.mongodbObjectId(),
    avatar: faker.image.avatar(),
    createAt: faker.date.past().toISOString(),
  }
  const userRequest = {
    email: userResponse.email,
    name: userResponse.name,
    password: faker.database.mongodbObjectId(),
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
  })

  it('should request return corrected', async () => {
    MockAxiosBackApi.onPost('/users/register', userRequest).replyOnce(200, {
      user: userResponse,
      token: jwtToken,
    })
    const { result } = renderHook(() => createUser(userRequest))

    expect(await result.current).toMatchObject({
      user: userResponse,
      token: jwtToken,
    })
  })

  it('should handle error when request for recused', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    MockAxiosBackApi.onPost('/users/register', userRequest).replyOnce(
      500,
      undefined
    )
    const { result } = renderHook(() => createUser(userRequest))

    expect(await result.current).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should handle empty response when fetching register user data', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    MockAxiosBackApi.onPost('/users/register', userRequest).replyOnce(
      200,
      undefined
    )
    const { result } = renderHook(() => createUser(userRequest))

    expect(await result.current).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })
})
