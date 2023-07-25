// @ts-nocheck

import { apiB } from '@/lib/api'
import { IGroupsRequestDTO } from '@/types/groups'

async function getGroupsList({ queryKey }: any): Promise<IGroupsRequestDTO> {
  const response = await apiB.get<IGroupsRequestDTO>(
    `/grupos?${queryKey[2] ? `nome=${queryKey[2]}` : ''}&current_page=${
      queryKey[1]
    }&limit=5`,
  )
  return response.data
}

const groupsListRequests = {
  getGroupsList,
}

export default groupsListRequests
