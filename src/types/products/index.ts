export interface IProductsEditDTO {
  status: number
  statusText: string
}

export interface ProductType {
  id: number
  sale_value: number
  guarantee_value: number
  tunap_code: string
  product_code: string
  name: string
  responsible: {
    id: number
    username: string
  }
  companie: {
    cnpj: string
    id: number
    name: string
  }
}
export interface IProductsRequestDTO {
  current_page: number
  limit: number
  total_products: number
  products: ProductType[]
}

export interface IProductsPutDTO {
  guarantee_value: number
  sale_value: number
  tunap_code: string
  id: number
}
