interface OsType {
  id: number
  company_id: number
  name: string
  code: string
  created_at: string
  updated_at: string
}

interface Brand {
  id: number
  company_id: number
  name: string
  active: boolean
  code: string
  image: any
}

interface Model {
  id: number
  company_id: number
  brand_id: number
  name: string
  active: boolean
  image: any
  integration_code: string
  brand: Brand
}

interface Vehicle {
  id: number
  company_id: number
  model_id: number
  name: string
  model_year: string
  active: boolean
  brand_id: number
  integration_code: string
  model: Model
}

interface ClientVehicle {
  id: number
  company_id: number
  vehicle_id: number
  chasis: string
  color: string
  number_motor: any
  renavan: any
  plate: string
  mileage: string
  vehicle: Vehicle
}

interface User {
  id: number
  user_id: any
  username: string
  name: string
  email: string
  phone: any
  birthday: any
  active: boolean
  privilege: string
  document: string
  user_tunap: boolean
}

interface TechnicalConsultant {
  id: number
  company_id: number
  user_id: number
  active: boolean
  name: string
  integration_code: string
  user: User
}

interface Client {
  id: number
  company_id: number
  name: string
  document: string
  address: any[]
  active: boolean
  created_at: string
  updated_at: string
  phone: any[]
  email: any[]
  cpf: any
  fullName: string
}

export interface QuotationType {
  id: number
  company_id: number
  vehicle_id: any
  client_id: number
  maintenance_review_id: any
  consultant_id: number
  created_at: string
  updated_at: string
  client_vehicle_id: number
  user_id: number
  os_type_id: number
  QtdPecas: number
  QtdServicos: number
  TotalPecas: number
  TotalPecasDesconto: number
  TotalServicos: number
  TotalServicosDesconto: number
  TotalGeral: number
  TotalGeralDesconto: number
  client: Client
  client_vehicle: ClientVehicle
  maintenance_review: any
  technical_consultant: TechnicalConsultant
  os_type: OsType
}
export interface QuotationResponseType {
  id: number
  company_id: number
  vehicle_id: any
  client_id: number
  maintenance_review_id: any
  consultant_id: number
  created_at: string
  updated_at: string
  client_vehicle_id: number
  user_id: number
  os_type_id: number
  QtdPecas: number
  QtdServicos: number
  TotalPecas: number
  TotalPecasDesconto: number
  TotalServicos: number
  TotalServicosDesconto: number
  TotalGeral: number
  TotalGeralDesconto: number
  client: Client
  client_vehicle: ClientVehicle
  maintenance_review: any
  technical_consultant: TechnicalConsultant
  os_type: OsType
  current_page: number
  total_pages: number
  total_results: number
}

export interface ProductType {
  id: number
  company_id: number
  name: string
  product_code: string
  sale_value: string
  guarantee_value: string
  tunap_code: any
  active: boolean
}

export interface TypeQuotationType {
  id: number
  company_id: number
  name: string
  code: string
}
