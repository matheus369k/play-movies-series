import { fireEvent, render, screen } from '@testing-library/react'
import { UserContextProvider, UserContext } from './user-context'
import { act, type ReactNode } from 'react'
import { faker } from '@faker-js/faker/locale/pt_BR'

const wrapper = ({ children }: { children: ReactNode }) => {
  return <UserContextProvider>{children}</UserContextProvider>
}

const userData = {
  avatar: faker.image.avatar(),
  createAt: faker.date.future().toISOString(),
  email: faker.internet.email(),
  id: faker.database.mongodbObjectId(),
  name: faker.person.firstName(),
}

describe('UserContext', () => {
  it('should provide default user values', () => {
    render(
      <UserContext.Consumer>
        {({ user }) => user && <div>showing</div>}
      </UserContext.Consumer>,
      { wrapper }
    )

    expect(screen.queryByText(/showing/i)).toBeNull()
  })

  it('should update user values', () => {
    render(
      <UserContext.Consumer>
        {({ user, setUserState }) => (
          <div>
            {user && <h1>{user.name}</h1>}
            <button onClick={() => setUserState(userData)}>update user</button>
          </div>
        )}
      </UserContext.Consumer>,
      { wrapper }
    )

    expect(screen.queryByRole('heading', { name: userData.name })).toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(/update user/i))
    })

    screen.getByRole('heading', { name: userData.name })
  })

  it('should reset user values', () => {
    render(
      <UserContext.Consumer>
        {({ user, resetUserState, setUserState }) => (
          <div>
            {user && <h1>{user.name}</h1>}
            <button onClick={() => setUserState(userData)}>update user</button>
            <button onClick={resetUserState}>reset user</button>
          </div>
        )}
      </UserContext.Consumer>,
      { wrapper }
    )

    expect(screen.queryByRole('heading', { name: userData.name })).toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(/update user/i))
    })

    screen.queryByRole('heading', { name: userData.name })

    act(() => {
      fireEvent.click(screen.getByText(/reset user/i))
    })

    expect(screen.queryByRole('heading', { name: userData.name })).toBeNull()
  })
})
