import { apiB } from '@/lib/api'

async function getProductsList({ queryKey }: any): Promise<any> {
  const nameKey = queryKey[2] ? `name=${queryKey[2]}` : ''
  const tunapCode = queryKey[3] ? `tunap_code=${queryKey[3]}` : ''
  const response = await apiB.get<any>(
    `/products?${nameKey}&current_page=${queryKey[1]}&limit=5&${tunapCode}product_code=harina&company_id=2&id_responsible=1`,
  )
  return response.data
}

const productsListRequests = {
  getProductsList,
}

export default productsListRequests
