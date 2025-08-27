import { createContext, useState } from 'react'

type UserProfileRequest = {
  name: string
  email: string
  id: string
  avatar: string | null
  createAt: string
}

interface UserContextType {
  user: UserProfileRequest | null
  resetUserState: () => void
  setUserState: (props: UserProfileRequest) => void
}

export const UserContext = createContext({} as UserContextType)

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserProfileRequest | null>(null)

  function setUserState(props: UserProfileRequest) {
    const { avatar, createAt, email, id, name } = props
    setUser({ avatar, createAt, email, id, name })
  }

  function resetUserState() {
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, resetUserState, setUserState }}>
      {children}
    </UserContext.Provider>
  )
}
