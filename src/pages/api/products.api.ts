import { apiB } from '@/lib/api'
import { IProductsRequestDTO, ProductType } from '@/types/products'

async function getProductsList({
  queryKey,
}: any): Promise<IProductsRequestDTO> {
  const nameKey = queryKey[2] ? `name=${queryKey[2]}` : ''
  const tunapCode = queryKey[4] ? `tunap_code=${queryKey[4]}` : ''
  const response = await apiB.get<IProductsRequestDTO>(
    `/products?${nameKey}&current_page=${queryKey[1]}&limit=5&${tunapCode}&id_responsible=1`,
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
