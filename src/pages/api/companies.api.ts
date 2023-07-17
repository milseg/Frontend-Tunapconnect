import { apiB } from '@/lib/api'
import { ICompaniesRequestDTO } from '@/types/companies'

async function getCompaniesList({
  queryKey,
}: any): Promise<ICompaniesRequestDTO> {
  const response = await apiB.get<ICompaniesRequestDTO>(
    `/companies?${queryKey[2] ? `nome=${queryKey[2]}` : ''}&current_page=${
      queryKey[1]
    }&limit=20`,
  )
  return response.data
}

const companiesListRequests = {
  getCompaniesList,
}

export default companiesListRequests
