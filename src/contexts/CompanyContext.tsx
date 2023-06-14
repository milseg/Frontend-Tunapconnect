import { createContext, ReactNode, useEffect, useState } from 'react'

import { parseCookies, setCookie } from 'nookies'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'

interface companyProps {
  id: number
  name: string | null
  cnpj: string | null
  cpf: string | null
  active?: boolean | null
}

type cookieCompany = {
  companySelected: string
}

type CompanyContextType = {
  companyData: companyProps | null
  companySelected: number | null
  createCompany: (value: companyProps, isRedirect: boolean) => void
  handleCompanySelected: (value: companyProps) => void
}

type GeralProviderProps = {
  children: ReactNode
}

export const CompanyContext = createContext({} as CompanyContextType)

export function CompanyProvider({ children }: GeralProviderProps) {
  const [companyData, setCompanyData] = useState<companyProps | null>(null)
  const [companySelected, setCompanySelected] = useState<number | null>(null)

  const router = useRouter()
  async function createCompany(company: companyProps, isRedirect: boolean) {
    const newCompany = {
      id: company.id,
      name: company.name,
      cnpj: company.cnpj,
      cpf: company.cpf,
    }

    setCompanyData(newCompany)

    setCompanySelected(company.id)
    setCookie(
      null,
      process.env.NEXT_PUBLIC_APP_COOKIE_STORAGE_NAME as string,
      JSON.stringify({
        companySelected: company.id,
      }),
      {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      },
    )
    isRedirect &&
      (await router.push(`/service-schedule?company_id=${company.id}`))
  }

  async function handleCompanySelected(company: companyProps) {
    await createCompany(company, true)
  }

  async function verifyCompany(company_id: string) {
    const getSessionData = await getSession()

    if (getSessionData?.user.companies) {
      if (getSessionData?.user.companies.length > 0) {
        const companies = getSessionData.user.companies
        const isExistCompany = companies.filter((company) => {
          return company.id === parseInt(company_id as string)
        })
        if (isExistCompany.length === 0) {
          router.push('/company')
        }
        const cookies = parseCookies()
        if (
          cookies[process.env.NEXT_PUBLIC_APP_COOKIE_STORAGE_NAME as string]
        ) {
          const companySelectedCookie: cookieCompany = JSON.parse(
            cookies[process.env.NEXT_PUBLIC_APP_COOKIE_STORAGE_NAME as string],
          )
          if (
            `${companySelectedCookie.companySelected}` !== company_id ||
            companyData === null
          ) {
            createCompany(
              {
                id: isExistCompany[0]?.id,
                name: isExistCompany[0]?.name,
                cnpj: isExistCompany[0]?.cnpj,
                cpf: isExistCompany[0]?.cpf,
                active: isExistCompany[0]?.active,
              },
              false,
            )
          }
        }
      }
    }
  }

  useEffect(() => {
    if (companySelected === null) {
      const cookies = parseCookies()
      if (cookies[process.env.NEXT_PUBLIC_APP_COOKIE_STORAGE_NAME as string]) {
        const companySelectedCookie: cookieCompany = JSON.parse(
          cookies[process.env.NEXT_PUBLIC_APP_COOKIE_STORAGE_NAME as string],
        )
        if (!companySelectedCookie.companySelected) router.push('/company')
        setCompanySelected(parseInt(companySelectedCookie.companySelected))
      } else {
        router.push('/company')
      }
    }
    if (companyData === null) {
      console.log(companySelected)
    }
  }, [])

  useEffect(() => {
    if (router.query.company_id) {
      verifyCompany(router.query.company_id as string)
    }
  }, [router.query])

  return (
    <CompanyContext.Provider
      value={{
        companyData,
        companySelected,
        createCompany,
        handleCompanySelected,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}
