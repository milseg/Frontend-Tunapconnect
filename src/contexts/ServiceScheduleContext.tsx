import { createContext, ReactNode } from 'react'

type ServiceScheduleContextProps = {}
type ServiceScheduleProviderProps = {
  children: ReactNode
}

const ServiceScheduleContext = createContext({} as ServiceScheduleContextProps)

export function ServiceScheduleProvider({
  children,
}: ServiceScheduleProviderProps) {
  return (
    <ServiceScheduleContext.Provider value={{}}>
      {children}
    </ServiceScheduleContext.Provider>
  )
}
