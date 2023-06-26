import { ChecklistProps } from '@/pages/checklist/types'
import { ChecklistModelType, ChecklistReturnType } from '@/types/checklist'
import { ServiceScheduleType } from '@/types/service-schedule'
import { createContext, ReactNode, useEffect, useReducer } from 'react'

type StateType = {
  serviceSchedule: ServiceScheduleType | null
  checklist: ChecklistReturnType | null
  checklistModel: ChecklistModelType | null
  serviceScheduleiSCreated: boolean
}

type ServiceScheduleContextProps = {
  serviceScheduleState: StateType
  setServiceScheduleiSCreated: (value: boolean) => void
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
      serviceScheduleiSCreated: false,
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
          serviceSchedule: payload.data,
          serviceScheduleiSCreated: payload.serviceScheduleiSCreated
        }
      case 'IS_CREATED_NEW_SERVICE_SCHEDULE':
        return {
          ...state,
          serviceScheduleiSCreated: payload.data
        }
      case 'ADD_NEW_SERVICE_SCHEDULE':
        return {
          ...state,
          serviceSchedule: payload.data,
          serviceScheduleiSCreated: payload.serviceScheduleiSCreated
        }
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

  function setServiceSchedule(dataServiceSchedule: ServiceScheduleType, serviceScheduleiSCreated = false ) {
    const data ={
      data: dataServiceSchedule,
      serviceScheduleiSCreated
    }
    dispatch({
      type: 'ADD_NEW_SERVICE_SCHEDULE',
      payload: data,
    })
  }

  function setServiceScheduleiSCreated(value: boolean) {
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
        setServiceScheduleiSCreated
      }}
    >
      {children}
    </ServiceScheduleContext.Provider>
  )
}
