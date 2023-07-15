export interface CompaniesType {
  created_at: string
  cnpj: number
  name: string
  id: number
  updated_at: number
  responsible_name: string
  integration_code: string
}

export interface ICompaniesEditDTO {
  status: number
  statusText: string
}

export interface ICompaniesRequestDTO {
  current_page: number
  companies: CompaniesType[]
  limit: number
  total_companies: number
}
