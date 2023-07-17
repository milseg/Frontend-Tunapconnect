export interface GroupsType {
  created_at: string
  id_group: number
  name: string
  updated_at: string
  qtd_empresas: number
}

export interface IGroupsEditDTO {
  status: number
  statusText: string
}

export interface IGroupsRequestDTO {
  current_page: number
  groups: GroupsType[]
  limit: number
  total_groups: number
}
