export interface IProductsEditDTO {
  status: number
  statusText: string
}

export interface IProductsRequestDTO {
  current_page: number
  limit: number
  total_groups: number
}

export interface ProductType {
  id: number
  sale_value: number
  guarantee_value: number
  tunap_code: string
}
