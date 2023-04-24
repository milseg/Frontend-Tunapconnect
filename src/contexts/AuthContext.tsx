import { createContext, ReactNode, useEffect, useState } from 'react'
import { signIn as signInRequest, useSession } from 'next-auth/react'

import Router from 'next/router'

type SignInData = {
  username: string
  password: string
}

type User = {
  id: string | undefined
  name: string | undefined
  privilege: string | undefined
}

type AuthContextType = {
  isAuthenticated: boolean
  signIn: (data: SignInData) => void
  user: User | null
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const { status, data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const isAuthenticated = !!user

  async function signIn(data: SignInData) {
    const resp = await signInRequest('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    })

    if (resp?.ok && resp?.status === 200) {
      setUser({
        id: session?.user.id,
        name: session?.user.name,
        privilege: session?.user.privilege,
      })
      await Router.push('/company')
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') Router.replace('/')
  }, [status])

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  )
}
