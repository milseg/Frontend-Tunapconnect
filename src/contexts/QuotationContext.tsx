import { ChecklistProps } from '@/pages/checklist/types'
import { ChecklistModelType, ChecklistReturnType } from '@/types/checklist'
import { ServiceScheduleType } from '@/types/service-schedule'
import { createContext, ReactNode, useEffect, useReducer } from 'react'

type StateType = {
  serviceSchedule: ServiceScheduleType | null
  checklist: ChecklistReturnType | null
  checklistModel: ChecklistModelType | null
  serviceScheduleIsCreated: boolean
}

type ServiceScheduleContextProps = {
  serviceScheduleState: StateType
  setServiceScheduleIsCreated: (value: boolean) => void
  setServiceSchedule: (data: ServiceScheduleType, isCreated?: boolean) => void
  setCheckList: (data: ChecklistProps) => void
  setCheckListModel: (data: ChecklistModelType) => void
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
      serviceScheduleIsCreated: false,
      checklist: null,
      checklistModel: null,
    },
  )

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
      case 'IS_CREATED_NEW_SERVICE_SCHEDULE':
        return {
          ...state,
          serviceScheduleIsCreated: payload,
        }
      // case 'ADD_NEW_SERVICE_SCHEDULE':
      //   return {
      //     ...state,
      //     serviceSchedule: payload.data,
      //   }
      case 'ADD_NEW_CHECKLIST':
        return {
          ...state,
          checklist: payload,
        }
      case 'ADD_NEW_CHECKLIST_MODEL':
        return {
          ...state,
          checklistModel: payload,
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

  function setServiceSchedule(dataServiceSchedule: ServiceScheduleType) {
    dispatch({
      type: 'ADD_NEW_SERVICE_SCHEDULE',
      payload: dataServiceSchedule,
    })
  }

  function setServiceScheduleIsCreated(value: boolean) {
    dispatch({
      type: 'IS_CREATED_NEW_SERVICE_SCHEDULE',
      payload: value,
    })
  }

  function setCheckList(data: ChecklistProps) {
    dispatch({
      type: 'ADD_NEW_CHECKLIST',
      payload: data,
    })
  }
  function setCheckListModel(data: ChecklistModelType) {
    dispatch({
      type: 'ADD_NEW_CHECKLIST_MODEL',
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
        setCheckListModel,
        setServiceScheduleIsCreated,
      }}
    >
      {children}
    </ServiceScheduleContext.Provider>
  )
}
