import { GroupsType } from '@/types/groups'

import { createContext, ReactNode, useReducer } from 'react'

type StateType = {
  group: GroupsType | null
  groupIsCreated: boolean
}

type GroupContextProps = {
  groupState: StateType
  setGroupIsCreated: (value: boolean) => void
  setGroup: (data: GroupsType) => void
}
type GroupProviderProps = {
  children: ReactNode
}

export const GroupContext = createContext({} as GroupContextProps)

export function GroupProvider({ children }: GroupProviderProps) {
  const [groupState, dispatch] = useReducer(groupListReducer, {
    group: null,
    groupIsCreated: false,
  })

  function groupListReducer(state: StateType, action: any): StateType {
    const { type, payload } = action
    switch (type) {
      case 'ADD_NEW_GROUP':
        return {
          ...state,
          group: payload,
        }
      case 'IS_CREATED_NEW_GROUP':
        return {
          ...state,
          groupIsCreated: payload,
        }
      case 'DELETE_BY_ID':
        return {
          ...state,
          group: payload,
        }
      default:
        return state
    }
  }

  function setGroup(dataGroup: GroupsType) {
    dispatch({
      type: 'ADD_NEW_GROUP',
      payload: dataGroup,
    })
  }

  function setGroupIsCreated(value: boolean) {
    dispatch({
      type: 'IS_CREATED_NEW_GROUP',
      payload: value,
    })
  }

  return (
    <GroupContext.Provider
      value={{
        groupState,
        setGroup,
        setGroupIsCreated,
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}
