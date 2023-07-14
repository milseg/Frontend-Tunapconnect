import { apiB } from '@/lib/api'
import { GroupsType } from '@/types/groups'

async function getGroupsList({ queryKey }: any): Promise<GroupsType[]> {
  const response = await apiB.get<GroupsType[]>(
    `/grupos?search=${queryKey[2]}&page=${queryKey[1]}&limit=5`,
  )
  return response.data
}

const groupsListRequests = {
  getGroupsList,
}

export default groupsListRequests
