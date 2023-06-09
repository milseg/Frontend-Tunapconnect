// import { ApiCore } from '@/lib/api'
import { ChecklistProps } from '@/pages/checklist/types'
import { ChecklistReturnType } from '@/types/checklist'
import { ServiceScheduleType } from '@/types/service-schedule'
import { createContext, ReactNode, useEffect, useReducer } from 'react'

type StateType = {
  serviceSchedule: ServiceScheduleType | null
  checklist: ChecklistReturnType | null
}

type ServiceScheduleContextProps = {
  serviceScheduleState: StateType
  setServiceSchedule: (data: ServiceScheduleType) => void
  setCheckList: (data: ChecklistProps) => void
}
type ServiceScheduleProviderProps = {
  children: ReactNode
}

export const ServiceScheduleContext = createContext(
  {} as ServiceScheduleContextProps,
)

export function ServiceScheduleProvider({
  children,
}: ServiceScheduleProviderProps) {
  const [serviceScheduleState, dispatch] = useReducer(
    serviceScheduleListReducer,
    {
      serviceSchedule: null,
      checklist: null,
    },
  )

  // const api = new ApiCore()

  function serviceScheduleListReducer(
    state: StateType,
    action: any,
  ): StateType {
    const { type, payload } = action
    switch (type) {
      case 'ADD_NEW_SERVICE_SCHEDULE':
        return {
          ...state,
          serviceSchedule: payload,
        }
      case 'ADD_NEW_CHECKLIST':
        return {
          ...state,
          checklist: payload,
        }
      case 'DELETE_BY_ID':
        return {
          ...state,
          serviceSchedule: payload,
        }
      default:
        return state
    }
  }

  function setServiceSchedule(data: ServiceScheduleType) {
    dispatch({
      type: 'ADD_NEW_SERVICE_SCHEDULE',
      payload: data,
    })
  }

  function setCheckList(data: ChecklistProps) {
    dispatch({
      type: 'ADD_NEW_CHECKLIST',
      payload: data,
    })
  }

  useEffect(() => {}, [])

  return (
    <ServiceScheduleContext.Provider
      value={{
        setServiceSchedule,
        setCheckList,
        serviceScheduleState,
      }}
    >
      {children}
    </ServiceScheduleContext.Provider>
  )
}
