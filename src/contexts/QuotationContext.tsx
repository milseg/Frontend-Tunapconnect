import { QuotationType } from '@/types/quotation'

import { createContext, ReactNode, useReducer } from 'react'

type StateType = {
  quotations: QuotationType | null
  quotationsIsCreated: boolean
}

type QuotationsContextProps = {
  quotationsState: StateType
  setQuotationsIsCreated: (value: boolean) => void
  setQuotations: (data: QuotationType) => void
}
type QuotationsProviderProps = {
  children: ReactNode
}

export const QuotationsContext = createContext({} as QuotationsContextProps)

export function QuotationsProvider({ children }: QuotationsProviderProps) {
  const [quotationsState, dispatch] = useReducer(quotationsListReducer, {
    quotations: null,
    quotationsIsCreated: false,
  })

  function quotationsListReducer(state: StateType, action: any): StateType {
    const { type, payload } = action
    switch (type) {
      case 'ADD_NEW_QUOTATION':
        return {
          ...state,
          quotations: payload,
        }
      case 'IS_CREATED_NEW_QUOTATION':
        return {
          ...state,
          quotationsIsCreated: payload,
        }
      case 'DELETE_BY_ID':
        return {
          ...state,
          quotations: payload,
        }
      default:
        return state
    }
  }

  function setQuotations(dataQuotations: QuotationType) {
    dispatch({
      type: 'ADD_NEW_QUOTATION',
      payload: dataQuotations,
    })
  }

  function setQuotationsIsCreated(value: boolean) {
    dispatch({
      type: 'IS_CREATED_NEW_QUOTATION',
      payload: value,
    })
  }

  return (
    <QuotationsContext.Provider
      value={{
        quotationsState,
        setQuotations,
        setQuotationsIsCreated,
      }}
    >
      {children}
    </QuotationsContext.Provider>
  )
}
