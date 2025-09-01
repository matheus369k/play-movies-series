import { render, screen } from '@testing-library/react'
import { UserAvatar } from './user-avatar'
import type { ReactNode } from 'react'
import { UserContext } from '@/contexts/user-context'
import { faker } from '@faker-js/faker/locale/pt_BR'

jest.mock('./ui/avatar.tsx', () => ({
  ...jest.requireActual('./ui/avatar.tsx'),
  AvatarImage: ({ ...props }) => <img {...props} />,
}))

const userData = {
  id: faker.database.mongodbObjectId(),
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
  createAt: faker.date.past().toISOString(),
}
const wrapper = ({
  children,
  user,
}: {
  children: ReactNode
  user: (Omit<typeof userData, 'avatar'> & { avatar: string | null }) | null
}) => {
  return (
    <UserContext.Provider
      value={{
        resetUserState: jest.fn(),
        setUserState: jest.fn(),
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

describe('<UserAvatar />', () => {
  it('should render avatar main picture when is has avatar without previewAvatar', () => {
    render(<UserAvatar />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    expect(screen.getByRole('img', { name: /main avatar/i })).toHaveAttribute(
      'src',
      userData.avatar
    )
  })

  it('should render avatar preview picture when is has or not has avatar and has previewAvatar', () => {
    const avatarPreview = faker.image.avatar()
    render(<UserAvatar avatarPreview={avatarPreview} />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    expect(
      screen.getByRole('img', { name: /preview avatar/i })
    ).toHaveAttribute('src', avatarPreview)
  })

  it('should render first letter email when has not avatar and previewAvatar', () => {
    const firstLetter = userData.email.slice(0, 1)
    render(<UserAvatar />, {
      wrapper: ({ children }) =>
        wrapper({
          children,
          user: {
            ...userData,
            avatar: null,
          },
        }),
    })

    screen.getByLabelText(/first letter avatar/i)
    screen.getByText(firstLetter)
  })
})
