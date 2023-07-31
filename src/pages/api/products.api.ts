import { apiB } from '@/lib/api'
import { IProductsRequestDTO, ProductType } from '@/types/products'

async function getProductsList({
  queryKey,
}: any): Promise<IProductsRequestDTO> {
  const nameKey = queryKey[2] ? `name=${queryKey[2]}` : ''
  const companyKey = queryKey[3] ? `company_id=${queryKey[3]}` : ''
  const response = await apiB.get<IProductsRequestDTO>(
    `/products?${nameKey}&current_page=${queryKey[1]}&limit=5${companyKey}`,
  )
  return response.data
}

async function getProductsDetail({ queryKey }: any): Promise<ProductType> {
  const response = await apiB.get<ProductType>(`/products/${queryKey[1]}`)
  return response.data
}

const productsListRequests = {
  getProductsList,
  getProductsDetail,
}

export default productsListRequests
