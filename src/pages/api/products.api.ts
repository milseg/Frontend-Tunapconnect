import { apiB } from '@/lib/api'

async function getProductsList({ queryKey }: any): Promise<any> {
  const nameKey = queryKey[2] ? `name=${queryKey[2]}` : ''
  const tunapCode = queryKey[4] ? `tunap_code=${queryKey[4]}` : ''
  console.log(tunapCode)
  const response = await apiB.get<any>(
    `/products?${nameKey}&current_page=${queryKey[1]}&limit=5&${tunapCode}&company_id=${queryKey[3]}&id_responsible=1`,
  )
  return response.data
}

const productsListRequests = {
  getProductsList,
}

export default productsListRequests
