import { StagesDataProps } from '@/pages/checklist/types'

export interface Rules {
  required: boolean
  type: string
}

export interface Label {
  name: string
  url_image: string
  value: any[]
  comment: any
  images: any[]
}

export interface Values {
  labels?: Label[]
  value: any
  images?: any[]
  options?: string[]
}

export interface Signature {
  name: string
  updated_at: any
  rules: Rules
  image: any[]
}
export interface Iten {
  name: string
  rules: Rules
  values: Values
  comment: any
  Code?: string
}

export interface Rules2 {
  required: boolean
  type: string
}

export interface Vehicleclient {
  id: number
  company_id: number
  vehicle_id: number
  chasis: string
  color: string
  number_motor: any
  renavan: any
  plate: string
  mileage: string
}

export interface Brand {
  id: number
  company_id: number
  name: string
  active: boolean
  code: string
  image: any
}

export interface Vehicle {
  id: number
  company_id: number
  model_id: number
  name: string
  model_year: string
  active: boolean
  brand_id: number
  integration_code: string
}

export interface Client {
  id: number
  company_id: number
  name: string
  document: string
  address: string[]
  active: boolean
  phone: string[]
  email: string[]
  fullName: string
  cpf: null | boolean
}

export interface Checklistmodels {
  id: number
  name: string
  description: string
  active: boolean
  stages: StagesDataProps[]
  created_at: string
  updated_at: string
  status: any
}

export interface Label2 {
  name: string
  url_image: string
  value: any[]
  comment: any
  images: any[]
}

export interface Serviceschedule {
  id: number
  company_id: number
  technical_consultant_id: number
  client_id: number
  code: any
  chasis: any
  plate: any
  promised_date: string
  client_vehicle_id: number
}

export interface ChecklistReturnType {
  id: number
  company_id: number
  brand_id: number
  vehicle_id: number
  vehicle_client_id: number
  client_id: number
  checklist_model: number
  km: number
  fuel: any
  stages: StagesDataProps[]
  created_at: string
  updated_at: string
  service_schedule_id: number
  status: string
  vehicleclient: Vehicleclient[]
  brand: Brand
  vehicle: Vehicle
  client: Client
  checklistmodels: Checklistmodels
  serviceschedule: Serviceschedule
}

export interface ChecklistModelType {
  id: number
  name: string
  description: string
  active: boolean
  stages: StagesDataProps[]
  created_at: string
  updated_at: string
  status: any
}

export interface CheckListResponseAxios {
  id: number
  company_id: number
  brand_id: number
  vehicle_id: number
  vehicle_client_id: number
  client_id: number
  checklist_model: number
  km: number
  fuel: any
  stages: StagesDataProps[]
  created_at: string
  updated_at: string
  service_schedule_id: number
  status: string
  vehicle: Vehicle
  vehicleclient: Vehicleclient
  client: Client
  brand: Brand
  serviceschedule: Serviceschedule
}
