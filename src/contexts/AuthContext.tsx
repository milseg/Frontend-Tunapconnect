import { createContext, ReactNode, useEffect, useState } from 'react'
import {
  getSession,
  signIn as signInRequest,
  useSession,
} from 'next-auth/react'

import Router from 'next/router'

type SignInData = {
  username: string
  password: string
}

type User = {
  id: string | undefined
  name: string | undefined
  privilege: string | undefined
  userTunap: boolean | undefined
}

interface companyProps {
  id: number
  name: string | null
  cnpj: string | null
  cpf: string | null
  active?: boolean | null
}

type AuthContextType = {
  isAuthenticated: boolean
  signIn: (data: SignInData) => Promise<string | undefined>
  user: User | null
  addCompaniesList: (company: companyProps[] | null) => void
  listCompanies: companyProps[] | null
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const { status } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [listCompanies, setListCompanies] = useState<companyProps[] | null>(
    null,
  )
  const isAuthenticated = !!user

  async function signIn(data: SignInData) {
    const resp = await signInRequest('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    })
    // console.log("signin")
    if (resp?.ok && resp?.status === 200) {
      // console.log("signin ok")
      const session = await getSession()
      // console.log("[AuthContext] saving user", session?.user)
      setUser({
        id: session?.user.id,
        name: session?.user.name,
        privilege: session?.user.privilege,
        userTunap: session?.user.userTunap,
      })
      setListCompanies(session?.user.companies as companyProps[])
      Router.push('/company')
    }

    if (!resp?.ok && resp?.status === 401) {
      return 'Usuário ou senha incorreto!'
    }
  }

  function addCompaniesList(company: companyProps[] | null) {
    setListCompanies(company)
  }

  useEffect(() => {
    if (
      status === 'unauthenticated' &&
      !Router.asPath.includes('/checklist-factory-view')
    )
      Router.replace('/')
  }, [status])

  useEffect(() => {
    getSession().then((session) => {
      setUser({
        id: session?.user.id,
        name: session?.user.name,
        privilege: session?.user.privilege,
        userTunap: session?.user.userTunap,
      })
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, user, addCompaniesList, listCompanies }}
    >
      {children}
    </AuthContext.Provider>
  )
}
