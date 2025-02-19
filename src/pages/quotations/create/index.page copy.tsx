/* eslint-disable no-unused-vars */
import * as React from 'react'

import { useContext, useEffect, useState } from 'react'

import Container from '@mui/material/Container'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import {
  ClaimServiceResponseType,
  ClientResponseType,
  TechnicalConsultant,
} from '@/types/service-schedule'
import { api } from '@/lib/api'

import { useRouter } from 'next/router'

import List from '@mui/material/List'

import Stack from '@mui/material/Stack'

import {
  ButtonAddItens,
  ButtonRemoveItens,
  ButtonSubmit,
  DividerCard,
  InfoCardName,
  InfoCardText,
  ListItemCard,
  TitleCard,
} from './styles'

import dayjs, { Dayjs } from 'dayjs'

import MenuItem from '@mui/material/MenuItem'

import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { formatDateTimeTimezone } from '@/ultis/formatDate'
import ActionAlerts from '@/components/ActionAlerts'
import { DataTimeInput } from '@/components/DataTimeInput'
import { ActionAlertsStateProps } from '@/components/ActionAlerts/ActionAlerts'
import HeaderBreadcrumb from '@/components/HeaderBreadcrumb'
import { listBreadcrumb } from '@/components/HeaderBreadcrumb/types'

import { useQuery } from 'react-query'

import { CompanyContext } from '@/contexts/CompanyContext'

import ModalSearchClientVehicle from './components/ModalSearchClientVehicle'
import ModalSearchClient from './components/ModalSearchClient'
import { ClientVehicleResponseType } from './components/ModalSearchClientVehicle/type'
import ModalCreateNewClient from './components/ModalCreateNewClient'
import ModalCreateNewClientVehicle from './components/ModalCreateNewClientVehicle'
import { MoreOptionsQuotation } from './components/MoreOptionsQuotation'
import ModalEditClient from './components/ModalEditClient'
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import ModalCreateEditClientVehicle from './components/ModalEditClientVehicle'
import ClaimServiceTable from './components/ClaimServiceTable'

import { formatCNPJAndCPFNumber } from '@/ultis/formatCNPJAndCPF'
import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
import { formatMoneyPtBR } from '@/ultis/formatMoneyPtBR'
import ModalSearchProduct from './components/ModalSearchProduct'
import {
  KitType,
  ProductType,
  ServicesType,
  TypeQuotationType,
} from '@/types/quotation'

import InputTableForEdit from '@/components/InputTableForEdit'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import ModalSearchService from './components/ModalSearchService'
import { CalcPerUnit } from './Calc'
import ModalSearchKit from './components/ModalSearchKit'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

type updateData = {
  code: null
  promised_date: string
  technical_consultant_id: number | undefined
  client_id: number | undefined
  client_vehicle_id: number | undefined
  company_id: string | undefined
  // chasis: string | undefined
  plate: string | undefined
  claims_service: any[]
  checklist_version_id: number | undefined
}

const HeaderBreadcrumbData: listBreadcrumb[] = [
  {
    label: 'Tunap',
    href: '/company',
  },
  {
    label: 'Edição de agendamento',
    href: '/service-schedule/edit',
  },
]

interface productsProps {
  list: ProductType[] | []
  totalDiscount: number
  total: number
}
interface servicesProps {
  list: ServicesType[] | []
  totalDiscount: number
  total: number
}
interface kitsProps {
  list: KitType[] | []
  totalDiscount: number
  total: number
}

const productSchema = z.object({
  product: z.array(
    z
      .object({
        id: z.number(),
        price: z.string(),
        quantity: z.string(),
        discount: z.string(),
      })
      .refine(
        (e) => {
          if (
            Number(e.discount.replace(/\./g, '').replace(/,/g, '.')) >=
            Number(e.price)
          ) {
            return false
          }
          return true
        },
        { message: 'Desconto inválido!' },
      ),
  ),
  // discount: z.string().refine(
  // (e) => {
  //   console.log(e)
  //   return false
  // },
  //   { message: 'Digite um valor valido!' },
  // ),
  // quantity: z.string(),
})
const serviceSchema = z.object({
  service: z.array(
    z
      .object({
        id: z.number(),
        price: z.string(),
        quantity: z.string(),
        discount: z.string(),
      })
      .refine(
        (e) => {
          console.log(
            Number(e.discount.replace(/\./g, '').replace(/,/g, '.')) >
              Number(e.price),
          )
          if (
            Number(e.discount.replace(/\./g, '').replace(/,/g, '.')) >=
            Number(e.price)
          ) {
            return false
          }
          return true
        },
        { message: 'Desconto inválido!' },
      ),
  ),
  // discount: z.string().refine(
  // (e) => {
  //   console.log(e)
  //   return false
  // },
  //   { message: 'Digite um valor valido!' },
  // ),
  // quantity: z.string(),
})

export default function QuotationsCreate() {
  const [products, setProducts] = useState<productsProps>({
    list: [],
    totalDiscount: 0,
    total: 0,
  })
  const [services, setServices] = useState<servicesProps>({
    list: [],
    totalDiscount: 0,
    total: 0,
  })
  const [kits, setKits] = useState<kitsProps>({
    list: [],
    totalDiscount: 0,
    total: 0,
  })

  const [client, setClient] = useState<ClientResponseType | null>(null)

  const [clientForModalSearch, setClientForModalSearch] =
    useState<ClientResponseType | null>(null)

  const [clientVehicleCreated, setClientVehicleCreated] =
    useState<ClientVehicleResponseType | null>(null)

  const [clientVehicle, setClientVehicle] =
    useState<ClientVehicleResponseType | null>(null)
  const [visitDate, setVisitDate] = useState<Dayjs | null>(dayjs(new Date()))
  const [technicalConsultant, setTechnicalConsultant] =
    useState<TechnicalConsultant | null>({
      id: 0,
      name: '-',
    })

  const [typeQuotation, setTypeQuotation] = useState({
    id: 0,
    name: '-',
  })
  const [technicalConsultantsList, setTechnicalConsultantsList] = useState<
    TechnicalConsultant[]
  >([])

  const [actionAlerts, setActionAlerts] =
    useState<ActionAlertsStateProps | null>(null)
  const [openModalSearchProduct, setOpenModalSearchProduct] = useState(false)
  const [openModalSearchServices, setOpenModalSearchServices] = useState(false)
  const [openModalSearchKit, setOpenModalSearchKit] = useState(false)

  const [openModalClientSearch, setOpenModalClientSearch] = useState(false)

  const [openModalClientVehicleSearch, setOpenModalClientVehicleSearch] =
    useState(false)

  const [claimServiceList, setClaimServiceList] = useState<
    ClaimServiceResponseType[]
  >([])

  const [openModalNewClient, setOpenModalNewClient] = useState(false)

  const [openModalEditClient, setOpenModalEditClient] = useState(false)

  const [openModalNewClientVehicle, setOpenModalNewClientVehicle] =
    useState(false)
  const [openModalEditClientVehicle, setOpenModalEditClientVehicle] =
    useState(false)

  const [isEditingProduct, setIsEditingProduct] = useState(false)
  const [isEditingService, setIsEditingService] = useState(false)
  const [isEditingKit, setIsEditingKit] = useState(false)

  const router = useRouter()

  const { companySelected } = useContext(CompanyContext)
  const { setServiceSchedule } = useContext(ServiceScheduleContext)

  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    setValue: setValueProduct,
    control: controlProduct,
    reset: resetProduct,
    getValues: getValuesProduct,
    formState: { errors: errorsProduct },
  } = useForm({
    resolver: zodResolver(productSchema),
  })

  const {
    append: appendProduct,
    remove: removeProduct,
    update: updateProduct,
    fields: fieldsProduct,
  } = useFieldArray({
    control: controlProduct,
    name: 'product',
  })

  const {
    register: registerService,
    handleSubmit: handleSubmitService,
    control: controlService,
    setValue: setValueService,
    formState: { errors: errorsService },
  } = useForm({
    resolver: zodResolver(serviceSchema),
  })

  const {
    append: appendService,
    remove: removeService,
    update: upadateService,
    fields: fieldsService,
  } = useFieldArray({
    control: controlService,
    name: 'service',
  })
  // const {
  //   register: registerClientVehicle,
  //   handleSubmit: handleSubmitClientVehicle,
  //   reset: resetClientVehicle,
  // } = useForm({
  //   defaultValues: {
  //     searchClientVehicle: '',
  //   },
  // })

  // function onSubmitClient(data: any) {
  //   setClientFormDataForModalSearch(data.searchClient)
  //   setOpenModalClientSearch(true)
  //   // resetClient()
  // }
  // function onSubmitClientVehicle(data: any) {
  //   setClientVehicleFormDataForModalSearch(data.searchClientVehicle)
  //   setOpenModalClientVehicleSearch(true)
  //   // resetClientVehicle()
  // }

  function onSubmitProduct(data: any) {
    const listProductsSaved = [...products.list]

    listProductsSaved.forEach((i) => {
      const findIndexData = data.product.findIndex(
        (d: ProductType) => d.id === i.id,
      )
      if (findIndexData > -1) {
        i.quantity = data.product[findIndexData].quantity
          .replace(/\./g, '')
          .replace(/,/g, '.')
        i.discount = data.product[findIndexData].discount
          .replace(/\./g, '')
          .replace(/,/g, '.')
        i.status = i.status === 'adding' ? 'saved' : i.status
      }
    })

    const totalDiscount = listProductsSaved
      .filter((i) => i.status !== 'excluded' && i.status !== 'cancelled')
      .reduce((acc, curr) => {
        return acc + Number(curr.discount) * Number(curr.quantity)
      }, 0)
    const total = listProductsSaved
      .filter((i) => i.status !== 'excluded' && i.status !== 'cancelled')
      .reduce((acc, curr) => {
        const totalItem = Number(curr.sale_value) * Number(curr.quantity)
        return acc + totalItem
      }, 0)
    setProducts((prevState) => ({
      ...prevState,
      list: listProductsSaved,
      total,
      totalDiscount,
    }))

    setIsEditingProduct(false)
  }

  function onSubmitService(data: any) {
    const listServicesSaved = [...services.list]

    listServicesSaved.forEach((i) => {
      const findIndexData = data.service.findIndex(
        (d: ServicesType) => d.id === i.id,
      )
      if (findIndexData > -1) {
        i.quantity = data.service[findIndexData].quantity
          .replace(/\./g, '')
          .replace(/,/g, '.')
        i.discount = data.service[findIndexData].discount
          .replace(/\./g, '')
          .replace(/,/g, '.')
        i.status = i.status === 'adding' ? 'saved' : i.status
      }
    })

    const totalDiscount = listServicesSaved
      .filter((i) => i.status !== 'excluded' && i.status !== 'cancelled')
      .reduce((acc, curr) => {
        return acc + Number(curr.discount) * Number(curr.quantity)
      }, 0)
    const total = listServicesSaved
      .filter((i) => i.status !== 'excluded' && i.status !== 'cancelled')
      .reduce((acc, curr) => {
        const totalItem = Number(curr.standard_value) * Number(curr.quantity)
        return acc + totalItem
      }, 0)

    setServices((prevState) => ({
      ...prevState,
      list: listServicesSaved,
      totalDiscount,
      total,
    }))

    // setServices((prevState) => {
    //   const newList = prevState.list.map((i, index) => {
    //     if (i.id === data.service[index].id) {
    //       const newService = { ...i }

    //       newService.status = 'saved'
    //       newService.quantity = data.service[index].quantity
    //         .replace(/\./g, '')
    //         .replace(/,/g, '.')
    //       newService.discount = data.service[index].discount
    //         .replace(/\./g, '')
    //         .replace(/,/g, '.')

    //       return newService
    //       // return {
    //       //   ...p,
    //       //   status: 'saved',
    //       //   quantity: data.service[index].quantity
    //       //     .replace(/\./g, '')
    //       //     .replace(/,/g, '.'),
    //       //   discount: data.service[index].discount
    //       //     .replace(/\./g, '')
    //       //     .replace(/,/g, '.'),
    //       // }
    //     } else {
    //       return p
    //     }
    //   })

    //   const totalDiscount = newList.reduce((acc, curr) => {
    //     return acc + Number(curr.discount) * Number(curr.quantity)
    //   }, 0)
    //   const total = newList.reduce((acc, curr) => {
    //     const totalItem = Number(curr.standard_value) * Number(curr.quantity)
    //     return acc + totalItem
    //   }, 0)

    //   console.log(totalDiscount)
    //   console.log(total)

    //   return {
    //     ...prevState,
    //     list: newList,
    //     totalDiscount,
    //     total,
    //   }
    // })
    setIsEditingService(false)
  }

  function handleCloseModalSearchProduct() {
    setOpenModalSearchProduct(false)
  }
  function handleCloseModalSearchServices() {
    setOpenModalSearchServices(false)
  }
  function handleCloseModalSearchKit() {
    setOpenModalSearchKit(false)
  }
  function handleCloseModalClienteSearch() {
    setOpenModalClientSearch(false)
  }
  function handleCloseModalClientVehicleSearch() {
    setOpenModalClientVehicleSearch(false)
  }
  // function handleCloseModalClaimServiceVehicleSearch() {
  //   setOpenModalClaimServiceSearch(false)
  // }

  function handleOpenModalNewClient() {
    setOpenModalNewClient(true)
  }
  function handleOpenModalNewClientVehicle() {
    setOpenModalNewClientVehicle(true)
  }
  function handleCloseModalNewClient() {
    setOpenModalNewClient(false)
  }
  function handleCloseModalEditClient() {
    setOpenModalEditClient(false)
  }
  function handleOpenModalEditClient() {
    setOpenModalEditClient(true)
  }
  function handleOpenModalEditClientVehicle() {
    setOpenModalEditClientVehicle(true)
  }

  function handleOpenModalClientSearch() {
    setClientForModalSearch(null)
    setOpenModalClientSearch(true)
  }
  function handleOpenModalClientVehicleSearch() {
    setOpenModalClientVehicleSearch(true)
  }

  function handleCloseModalNewClientVehicle() {
    setOpenModalNewClientVehicle(false)
  }
  function handleCloseModalEditClientVehicle() {
    setOpenModalEditClientVehicle(false)
  }

  // function handleSaveNewClient() {
  //   setOpenModalNewClient(false)
  //   // setOpenModalClientSearch(true)
  // }
  function handleSaveReturnClient(value: ClientResponseType | null) {
    setClientForModalSearch(value)
    setOpenModalNewClient(false)
    setOpenModalClientSearch(true)
  }

  function handleSaveReturnClientVehicle(
    value: ClientVehicleResponseType | null,
  ) {
    setClientVehicleCreated(value)
    setOpenModalNewClientVehicle(false)
    setOpenModalClientVehicleSearch(true)
  }

  function handleEditClient() {
    setOpenModalNewClient(false)
    // setOpenModalClientSearch(true)
  }

  function handleSaveEditClientVehicle() {
    setOpenModalEditClientVehicle(false)
    // setOpenModalClientSearch(true)
  }

  function handleTechnicalConsultant(id: number) {
    setTechnicalConsultant((prevState) => {
      return technicalConsultantsList.filter((c) => c.id === id)[0]
    })
  }
  function handleTypeQuotation(id: number) {
    // @ts-ignore
    setTypeQuotation((prevState) => {
      return dataTypeQuotationList?.filter((q) => q.id === id)[0]
    })
  }

  function handleIsEditingOptions(type: string) {
    switch (type) {
      case 'service':
        setIsEditingService(true)
        break
      case 'product':
        setIsEditingProduct(true)
        break
      case 'kit':
        setIsEditingKit(true)
        break
      default:
    }
  }

  function handleRemoveProduct(id: number) {
    setProducts((prevState) => {
      const newList = prevState.list.map((p) => {
        if (p.id === id) {
          const newStatus = { ...p }
          newStatus.status = 'excluded'
          return newStatus
        }

        return p
      })

      return {
        ...prevState,
        list: newList,
      }
    })

    // const productIndex = products.list.findIndex((p) => p.id !== id)
    // removeProduct(productIndex)
    // setProducts((prevState) => {
    //   const newList = prevState.list.filter((p) => p.id !== id)

    //   newList.forEach((i, index) => {
    //     console.log(i.discount)
    //     setValueProduct(`product.${index}.id`, i.id)
    //     setValueProduct(
    //       `product.${index}.discount`,
    //       i.discount.replace('.', ','),
    //     )
    //     setValueProduct(`product.${i}.quantity`, i.quantity.replace('.', ','))
    //   })

    //   const totalDiscount = newList.reduce((acc, curr) => {
    //     return acc + Number(curr.discount) * Number(curr.quantity)
    //   }, 0)
    //   const total = newList.reduce((acc, curr) => {
    //     const totalItem = Number(curr.sale_value) * Number(curr.quantity)
    //     return acc + totalItem
    //   }, 0)

    //   return {
    //     ...prevState,
    //     list: prevState.list.filter((p) => p.id !== id),
    //     total,
    //     totalDiscount,
    //   }
    // })
  }
  function handleRemoveService(id: number) {
    setServices((prevState) => {
      const newList = prevState.list.map((s) => {
        if (s.id === id) {
          const newStatus = { ...s }
          newStatus.status = 'excluded'
          return newStatus
        }

        return s
      })

      return {
        ...prevState,
        list: newList,
      }
    })
  }

  function handleCalcValueTotalPerItem(
    price: number,
    qtd: number,
    discount: number,
  ) {
    // const priceFormatted = Number(price)
    // const discountFormatted = Number(
    //   discount.replace(/\./g, '').replace(/,/g, '.'),
    // )
    // const qtdFormatted = Number(qtd)
    const result = (price - discount) * qtd

    return result
  }
  // function handleCalcValueTotal(price: string, qtd: string, discount: string) {
  //   products.reduce(acc, curr)
  // }

  function handleAlert(isOpen: boolean) {
    setActionAlerts({
      isOpen,
      title: '',
      type: 'success',
    })
  }

  function handleCancelled() {}

  // function handleDateSchedule(data: Dayjs | null) {
  //   setVisitDate(data)
  // }

  function handleRemoveClaimService(id: number) {
    setClaimServiceList((prevState) => prevState.filter((c) => c.id !== id))
  }

  async function handleSaveClaimService(data: string) {
    console.log(data)
    try {
      const resp = await api.post('/claim-service', {
        company_id: companySelected,
        description: data,
      })
      console.log(resp)
      const isClaimService = claimServiceList.findIndex(
        (r) => r.id === resp.data.data.id,
      )
      if (isClaimService < 0) {
        setClaimServiceList((prevState) => [...prevState, resp.data.data])
      }
      // setActionAlerts({
      //   isOpen: true,
      //   title: `${resp.data.msg ?? 'Salvo com sucesso!'}!`,
      //   type: 'success',
      // })
    } catch (e: any) {
      setActionAlerts({
        isOpen: true,
        title: `${e.response.data.msg ?? 'Error inesperado'}!`,
        type: 'error',
      })
    }
  }

  async function onSave() {
    // const dataFormatted: updateData = {
    //   code: null,
    //   promised_date: formatDateTimeTimezone(`${visitDate}`),
    //   technical_consultant_id: technicalConsultant?.id,
    //   client_id: client?.id,
    //   client_vehicle_id: clientVehicle?.id,
    //   company_id: `${companySelected}`,
    //   plate: clientVehicle?.plate,
    //   claims_service:
    //     claimServiceList.map((c) => ({ claim_service_id: c.id })) ?? [],
    //   checklist_version_id: 14,
    // }

    const productListFormatted = products.list
      .filter((i) => i.status === 'saved')
      .map((item) => {
        return {
          service_id: null,
          products_id: item.id,
          price: `${item.sale_value}`,
          price_discount: `${item.discount}`,
          quantity: `${item.quantity}`,
        }
      })
    const servicesListFormatted = services.list
      .filter((i) => i.status === 'saved')
      .map((item) => {
        return {
          service_id: item.id,
          products_id: null,
          price: `${item.standard_value}`,
          price_discount: `${item.discount}`,
          quantity: `${item.quantity}`,
        }
      })

    const dataFormatted = {
      company_id: companySelected,
      client_vehicle_id: clientVehicle?.id,
      client_id: client?.id,
      os_type_id: typeQuotation.id,
      maintenance_review_id: null,
      consultant_id: technicalConsultant?.id,
      mandatory_itens: [],
      quotation_itens: [...productListFormatted, ...servicesListFormatted],
      claim_services: claimServiceList.map((i) => ({ claim_service_id: i.id })),
    }

    console.log(dataFormatted)

    try {
      const respCreate: any = await api.post('/quotations', dataFormatted)
      const idCreatedResponse = respCreate.data.data
      // setServiceSchedule(idCreatedResponse, true)

      console.log(idCreatedResponse)

      // router.push('/service-schedule/' + idCreatedResponse.id)

      setActionAlerts({
        isOpen: true,
        title: `${respCreate?.data?.msg ?? 'Salvo com sucesso!'}!`,
        type: 'success',
      })
    } catch (e: any) {
      console.error(e)
      setActionAlerts({
        isOpen: true,
        title: `${e.response.data.msg ?? 'Error inesperado'}!`,
        type: 'error',
      })
    }
  }

  function handleAddProduct(prod: ProductType, qtd?: number) {
    if (!isEditingProduct) {
      setIsEditingProduct(true)
    }
    const newList = [...products.list]

    const isExistsProduct = newList.findIndex((p) => p.id === prod.id)

    if (isExistsProduct > -1) {
      newList.map((p, index) => {
        if (p.id === prod.id) {
          if (p.status === 'saved') {
            setValueProduct(`product.${index}.discount`, p.discount)
            setValueProduct(
              `product.${index}.quantity`,
              `${
                qtd ? Number(p.quantity) + Number(qtd) : Number(p.quantity) + 1
              }`.replace('.', ','),
              // `${Number(p.quantity) + 1}`.replace('.', ','),
            )
            return {
              ...p,
              // quantity: `${Number(p.quantity) + 1 + Number(qtd)}`,
              quantity: `${
                qtd ? Number(p.quantity) + Number(qtd) : Number(p.quantity) + 1
              }`,
            }
          }

          if (p.status === 'excluded' || p.status === 'cancelled') {
            p.status = 'adding'
            setValueProduct(`product.${index}.discount`, '0,00')
            setValueProduct(`product.${index}.quantity`, '1')
            return {
              ...p,
              // quantity: `1`,
              quantity: `${qtd ? Number(qtd) : 1}`,
            }
          }

          // p.status = 'adding'
          // const newQuantity = qtd ? Number(qtd) : 1
          // console.log(newQuantity)
          // setValueProduct(`product.${index}.quantity`, `${newQuantity}`)
          // setValueProduct(
          //   `product.${index}.quantity`,
          //   // `${Number(p.quantity) + 1}`.replace('.', ','),
          //   `${newQuantity}`.replace('.', ','),
          // )
          // return {
          //   ...p,
          //   // quantity: `${newQuantity}`,
          //   quantity: `${newQuantity}`,
          // }
        }
        return p
      })
      setProducts((prevState) => {
        return {
          ...prevState,
          list: newList,
        }
      })
    } else {
      const newProduct = { ...prod }
      const productsListForm = getValuesProduct()
      console.log(newProduct)
      console.log(productsListForm.product)
      console.log(productsListForm)
      console.log(products.list.length)
      // setValueProduct(
      //   `product.${productsListForm.product.length}.id`,
      //   newProduct.id,
      // )
      // setValueProduct(
      //   `product.${productsListForm.product.length}.quantity`,
      //   `${qtd ? Number(qtd) : 1}`.replace('.', ','),
      // )

      // setValueProduct(
      //   `product.${productsListForm.product.length}.discount`,
      //   '0,00',
      // )
      // setValueProduct(
      //   `product.${productsListForm.product.length}.price`,
      //   newProduct.sale_value,
      // )
      console.log('adding product')
      newProduct.status = 'adding'
      newProduct.discount = '0,00'
      newProduct.quantity = `${qtd ? Number(qtd) : 1}`
      setProducts((prevState) => {
        return {
          ...prevState,
          list: [...prevState.list, newProduct],
        }
      })
    }

    if (openModalSearchProduct) {
      setOpenModalSearchProduct(false)
    }
  }

  function handleCancelProducts() {
    const newList = [...products.list]
    console.log(newList)
    newList.forEach((i, index) => {
      setValueProduct(`product.${index}.discount`, i.discount.replace('.', ','))
      setValueProduct(`product.${index}.quantity`, i.quantity.replace('.', ','))
      if (i.status === 'adding') {
        i.status = 'cancelled'
      }
    })

    setProducts((prevState) => {
      const totalDiscount = newList
        .filter((i) => i.status === 'saved')
        .reduce((acc, curr) => {
          return acc + Number(curr.discount) * Number(curr.quantity)
        }, 0)
      const total = newList
        .filter((i) => i.status === 'saved')
        .reduce((acc, curr) => {
          const totalItem = Number(curr.sale_value) * Number(curr.quantity)
          return acc + totalItem
        }, 0)

      return {
        ...prevState,
        list: newList,
        totalDiscount,
        total,
      }
    })

    setIsEditingProduct(false)
  }

  function handleAddServices(serv: ServicesType) {
    if (!isEditingService) {
      setIsEditingService(true)
    }

    const newList = [...services.list]

    const isExistsService = newList.findIndex((s) => s.id === serv.id)

    if (isExistsService > -1) {
      newList.map((s, index) => {
        if (s.id === serv.id) {
          if (s.status === 'saved') {
            setValueService(`service.${index}.discount`, s.discount)
            setValueService(
              `service.${index}.quantity`,
              `${Number(s.quantity) + Number(serv.standard_quantity)}`.replace(
                '.',
                ',',
              ),
            )
            return {
              ...s,
              quantity: `${
                Number(s.quantity) + Number(serv.standard_quantity)
              }`,
            }
          }

          if (s.status === 'excluded' || s.status === 'cancelled') {
            s.status = 'adding'
            setValueService(`service.${index}.discount`, '0,00')
            setValueService(
              `service.${index}.quantity`,
              serv.standard_quantity.replace('.', ','),
            )
            console.log(serv.standard_quantity)
            return {
              ...s,
              quantity: `${Number(serv.standard_quantity)}`,
            }
          }

          s.status = 'adding'
          const newQuantity =
            Number(s.quantity) + Number(serv.standard_quantity)
          setValueService(
            `service.${index}.quantity`,
            serv.standard_quantity.replace('.', ','),
          )
          setValueService(
            `service.${index}.quantity`,
            `${Number(s.quantity) + Number(serv.standard_quantity)}`.replace(
              '.',
              ',',
            ),
          )
          return {
            ...s,
            quantity: `${newQuantity}`,
          }
        }
        return s
      })
      setServices((prevState) => {
        return {
          ...prevState,
          list: newList,
        }
      })
    } else {
      const newService = { ...serv }

      setValueService(`service.${services.list.length}.id`, newService.id)
      setValueService(
        `service.${services.list.length}.quantity`,
        `${Number(newService.standard_quantity)}`.replace('.', ','),
      )

      setValueService(`service.${services.list.length}.discount`, '0,00')
      setValueService(
        `service.${services.list.length}.price`,
        newService.standard_value,
      )
      console.log('adding service')
      newService.status = 'adding'
      newService.discount = '0,00'
      newService.quantity = `${Number(newService.standard_quantity)}`
      setServices((prevState) => {
        return {
          ...prevState,
          list: [...prevState.list, newService],
        }
      })
    }

    // setServices((prevState) => {
    //   const isExistsService = prevState.list.findIndex((s) => s.id === serv.id)

    //   if (isExistsService > -1) {
    //     const newList = [...prevState.list].map((s, index) => {
    //       if (s.id === serv.id) {
    //         setValueService(
    //           `service.${index}.quantity`,
    //           `${Number(s.quantity) + Number(serv.standard_quantity)}`.replace(
    //             '.',
    //             ',',
    //           ),
    //         )

    //         setValueService(`service.${index}.discount`, s.discount)
    //         setValueService(
    //           `service.${prevState.list.length}.price`,
    //           s.standard_value,
    //         )
    //         if (s.status === 'saved') {
    //           setValueService(`service.${index}.discount`, s.discount)
    //           setValueService(
    //             `service.${index}.quantity`,
    //             `${
    //               Number(s.quantity) + Number(serv.standard_quantity)
    //             }`.replace('.', ','),
    //           )
    //           return {
    //             ...s,
    //             quantity: `${
    //               Number(s.quantity) + Number(serv.standard_quantity)
    //             }`,
    //           }
    //         }

    //         if (s.status === 'excluded' || s.status === 'cancelled') {
    //           s.status = 'adding'
    //           setValueService(`service.${index}.discount`, '0,00')
    //           setValueService(
    //             `service.${index}.quantity`,
    //             serv.standard_quantity.replace('.', ','),
    //           )
    //           console.log(serv.standard_quantity)
    //           return {
    //             ...s,
    //             quantity: `${Number(serv.standard_quantity)}`,
    //           }
    //         }
    //         s.status = 'adding'
    //         const newQuantity =
    //           Number(s.quantity) + Number(serv.standard_quantity)
    //         setValueService(
    //           `service.${index}.quantity`,
    //           serv.standard_quantity.replace('.', ','),
    //         )
    //         setValueService(
    //           `service.${index}.quantity`,
    //           `${Number(s.quantity) + Number(serv.standard_quantity)}`.replace(
    //             '.',
    //             ',',
    //           ),
    //         )
    //         return {
    //           ...s,
    //           quantity: `${newQuantity}`.replace('.', ','),
    //         }
    //       }
    //       return s
    //     })
    //     return {
    //       ...prevState,
    //       list: newList,
    //     }
    //   }

    //   setValueService(`service.${prevState.list.length}.id`, serv.id)
    //   setValueService(
    //     `service.${prevState.list.length}.quantity`,
    //     serv.standard_quantity.replace('.', ','),
    //   )
    //   setValueService(`service.${prevState.list.length}.discount`, '0')
    //   setValueService(
    //     `service.${prevState.list.length}.price`,
    //     serv.standard_value,
    //   )
    //   console.log(serv.standard_quantity.replace('.', ','))
    //   return {
    //     ...prevState,
    //     list: [
    //       ...prevState.list,
    //       {
    //         ...serv,
    //         quantity: serv.standard_quantity,
    //         discount: '0',
    //         status: 'adding',
    //       },
    //     ],
    //   }
    // })

    if (openModalSearchServices) {
      setOpenModalSearchServices(false)
    }
  }

  function handleCancelServices() {
    const newList = [...services.list]
    console.log(newList)
    newList.forEach((i, index) => {
      setValueService(`service.${index}.discount`, i.discount.replace('.', ','))
      setValueService(`service.${index}.quantity`, i.quantity.replace('.', ','))
      if (i.status === 'adding') {
        i.status = 'cancelled'
      }
    })

    setServices((prevState) => {
      const totalDiscount = newList
        .filter((i) => i.status === 'saved')
        .reduce((acc, curr) => {
          return acc + Number(curr.discount) * Number(curr.quantity)
        }, 0)
      const total = newList
        .filter((i) => i.status === 'saved')
        .reduce((acc, curr) => {
          const totalItem = Number(curr.standard_value) * Number(curr.quantity)
          return acc + totalItem
        }, 0)

      return {
        ...prevState,
        list: newList,
        totalDiscount,
        total,
      }
    })

    // setValueProduct(`product.${prevState.list.length}.discount`, '0,00')
    // setValueProduct(`product.${prevState.list.length}.price`, prod.sale_value)

    setIsEditingService(false)
  }

  function handleAddKits(kit: KitType) {
    console.log(kit)
    // if (!isEditingService) {
    //   setIsEditingService(true)
    // }

    // setKits((prevState) => {
    //   const isExistsService = prevState.list.findIndex((s) => s.id === serv.id)

    //   if (isExistsService > -1) {
    //     const newList = prevState.list.map((s, index) => {
    //       if (s.id === serv.id) {
    //         setValueService(
    //           `service.${index}.quantity`,
    //           Number(s.quantity) + serv.standard_quantity,
    //         )
    //         setValueService(`service.${index}.discount`, s.discount)
    //         return {
    //           ...s,
    //           quantity: `${Number(s.quantity) + 1}`,
    //         }
    //       }
    //       return s
    //     })
    //     return {
    //       ...prevState,
    //       list: newList,
    //     }
    //   }

    //   setValueService(`service.${prevState.list.length}.id`, serv.id)
    //   setValueService(
    //     `service.${prevState.list.length}.quantity`,
    //     serv.standard_quantity,
    //   )
    //   setValueService(`service.${prevState.list.length}.discount`, '0')
    //   return {
    //     ...prevState,
    //     list: [
    //       ...prevState.list,
    //       {
    //         ...serv,
    //         quantity: serv.standard_quantity,
    //         discount: '0',
    //       },
    //     ],
    //   }
    // })

    kit.products.forEach((prod) => {
      handleAddProduct(prod.product, Number(prod.quantity))
    })

    setKits((prevState) => {
      return {
        ...prevState,
        list: [...prevState.list, kit],
      }
    })

    if (openModalSearchKit) {
      setOpenModalSearchKit(false)
    }
  }

  function handleAddClient(client: ClientResponseType) {
    setClient(client)
    if (openModalEditClient) {
      setOpenModalEditClient(false)
    }
  }
  function handleAddClientVehicle(client_vehicle: ClientVehicleResponseType) {
    // setClientVehicle(null)
    setClientVehicle(client_vehicle)
    setClientVehicleCreated(null)
    if (openModalEditClientVehicle) {
      setOpenModalEditClientVehicle(false)
    }
  }

  const {
    data: dataTechnicalConsultantList,
    status: dataTechnicalConsultantListStatus,
  } = useQuery<TechnicalConsultant[]>(
    [
      'service_schedule',
      'by_id',
      'edit',
      'technical-consultant-list',
      'options',
    ],
    async () => {
      const resp = await api.get(
        `/technical-consultant?company_id=${companySelected}`,
      )
      return resp.data.data
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
  const { data: dataTypeQuotationList, status: dataTypeQuotationListStatus } =
    useQuery<TypeQuotationType[]>(
      [
        'Quotation-create',
        'edit',
        'technical-consultant-list',
        'options',
        companySelected,
      ],
      async () => {
        const resp = await api.get(`/os?company_id=${companySelected}`)
        return resp.data.data
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    )

  useEffect(() => {
    if (dataTechnicalConsultantListStatus === 'success') {
      setTechnicalConsultantsList(
        dataTechnicalConsultantList.map((item: TechnicalConsultant) => ({
          id: item.id,
          name: item.name,
        })),
      )
    }
  }, [dataTechnicalConsultantListStatus, dataTechnicalConsultantList])

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <HeaderBreadcrumb data={HeaderBreadcrumbData} title="Orçamento" />
          </Grid>

          <Grid item xs={12} md={7} lg={7}>
            <Stack spacing={3}>
              {/* ORÇAMENTO TIPO */}
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TitleCard>Orçamento</TitleCard>
                  <MoreOptionsQuotation disabledButton />
                </Stack>
                <DividerCard />
                <List dense={false}>
                  {/* <ListItemCard>
                    <InfoCardName>Data da emissão:</InfoCardName>

                    <DataTimeInput
                      dateSchedule={visitDate}
                      handleDateSchedule={handleDateSchedule}
                    />
                  </ListItemCard> */}
                  <ListItemCard>
                    <InfoCardName>Responsável:</InfoCardName>{' '}
                    <Box width="100%">
                      <TextField
                        id="standard-select-currency"
                        select
                        sx={{
                          width: '100%',
                        }}
                        value={technicalConsultant?.id}
                        variant="standard"
                        onChange={(e) =>
                          handleTechnicalConsultant(parseInt(e.target.value))
                        }
                      >
                        <MenuItem value={technicalConsultant?.id}>
                          {'Selecione um Consultor'}
                        </MenuItem>
                        {technicalConsultantsList.map((option) => (
                          <MenuItem
                            key={option.id + option.name}
                            value={option.id}
                          >
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </ListItemCard>
                  <ListItemCard>
                    <InfoCardName>Tipo de orçamento:</InfoCardName>{' '}
                    <Box width="100%">
                      <TextField
                        id="standard-select-currency"
                        select
                        sx={{
                          width: '100%',
                        }}
                        value={typeQuotation?.id}
                        variant="standard"
                        onChange={(e) =>
                          handleTypeQuotation(parseInt(e.target.value))
                        }
                      >
                        <MenuItem value={0}>{'Selecione um tipo'}</MenuItem>
                        {dataTypeQuotationList &&
                          dataTypeQuotationList.map((option) => (
                            <MenuItem
                              key={option.id + option.name}
                              value={option.id}
                            >
                              {option.name}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Box>
                  </ListItemCard>
                </List>
              </Paper>

              {/* Reclamações */}
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TitleCard>Reclamações</TitleCard>
                  <MoreOptionsQuotation
                    aria-label="options claims service"
                    buttons={[
                      {
                        label: 'Editar',
                        action: () => {},
                      },
                      {
                        label: 'Pesquisar',
                        action: () => {},
                      },
                    ]}
                    disabledButton
                  />
                </Stack>
                <DividerCard />

                <ClaimServiceTable
                  claimServiceList={claimServiceList}
                  handleSaveClaimService={handleSaveClaimService}
                  handleRemoveClaimService={handleRemoveClaimService}
                />
              </Paper>
              {/* BOTÕES ADICIONADOS  */}
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  <ButtonAddItens
                    startIcon={<AddIcon />}
                    onClick={() => setOpenModalSearchKit(true)}
                  >
                    Kit
                  </ButtonAddItens>
                  <ButtonAddItens
                    startIcon={<AddIcon />}
                    onClick={() => setOpenModalSearchServices(true)}
                  >
                    Serviços
                  </ButtonAddItens>
                  <ButtonAddItens
                    startIcon={<AddIcon />}
                    onClick={() => setOpenModalSearchProduct(true)}
                  >
                    Peças
                  </ButtonAddItens>
                </Stack>
              </Paper>

              {/* Serviços */}
              <Stack
                component="form"
                gap={1}
                onSubmit={handleSubmitService(onSubmitService)}
              >
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TitleCard sx={{ flex: 1 }}>Serviços</TitleCard>
                    {/* <Box sx={{ marginRight: 1 }}>
                    <ButtonAddItens>
                      <AddIcon />
                    </ButtonAddItens>
                  </Box> */}

                    <MoreOptionsQuotation
                      aria-label="options to quotation"
                      disabledButton={!(services.list.length > 0)}
                      buttons={[
                        {
                          label: 'Editar',
                          action: handleIsEditingOptions,
                          type: 'service',
                        },
                      ]}
                    />
                  </Stack>
                  <DividerCard />
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Descrição</TableCell>
                          <TableCell align="center">QTD</TableCell>
                          <TableCell align="center">Desconto(UNID.)</TableCell>
                          <TableCell align="center">Valor</TableCell>
                          <TableCell align="center">Total</TableCell>
                          {isEditingService && (
                            <TableCell align="center">Ações</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* {!(services?.list.length > 0) && ( */}
                        {!(
                          services?.list.filter(
                            (s) =>
                              s.status === 'saved' || s.status === 'adding',
                          ).length > 0
                        ) &&
                          !isEditingService && (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                align="center"
                                colSpan={isEditingService ? 7 : 6}
                                sx={{ paddingTop: 4 }}
                              >
                                Nenhum serviço cadastrado.
                              </TableCell>
                            </TableRow>
                          )}
                        {!(
                          services?.list.filter(
                            (s) =>
                              s.status === 'saved' || s.status === 'adding',
                          ).length > 0
                        ) &&
                          isEditingService && (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                align="center"
                                colSpan={isEditingService ? 7 : 6}
                                sx={{ paddingTop: 4 }}
                              >
                                Nenhum serviço cadastrado.
                              </TableCell>
                            </TableRow>
                          )}
                        {!isEditingService &&
                          services?.list.length > 0 &&
                          services.list.map((serv, index) => {
                            if (
                              serv.status === 'excluded' ||
                              serv.status === 'cancelled'
                            )
                              return null
                            return (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                                key={serv.id}
                              >
                                <TableCell align="left">
                                  {serv.service_code}
                                </TableCell>
                                <TableCell align="left">
                                  {serv.description
                                    ? serv.description
                                    : 'Não informado'}
                                </TableCell>
                                <TableCell align="center">
                                  {serv.quantity}
                                </TableCell>
                                <TableCell align="center">
                                  {/* {prod.discount} */}
                                  {formatMoneyPtBR(serv.discount)}
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(Number(serv.standard_value))}
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(
                                    handleCalcValueTotalPerItem(
                                      Number(serv.standard_value),
                                      Number(serv.quantity),
                                      Number(serv.discount),
                                    ),
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        {isEditingService &&
                          services?.list.length > 0 &&
                          services.list.map((serv, index) => {
                            if (
                              serv.status === 'excluded' ||
                              serv.status === 'cancelled'
                            )
                              return null
                            return (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                                key={serv.id}
                              >
                                <TableCell align="left">
                                  {serv.service_code}
                                </TableCell>
                                <TableCell align="left">
                                  {serv.description
                                    ? serv.description
                                    : 'Não informado'}
                                </TableCell>
                                <TableCell align="center">
                                  <InputTableForEdit.number
                                    control={controlService}
                                    name={`service.${index}.quantity`}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <InputTableForEdit.money
                                    control={controlService}
                                    name={`service.${index}.discount`}
                                  />
                                  {errorsService.service &&
                                    // @ts-ignore
                                    errorsService.service[index] &&
                                    // @ts-ignore
                                    errorsService.service[index].message && (
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: 'red',
                                        }}
                                      >
                                        {/* @ts-ignore */}
                                        {errorsService.service[index].message}
                                      </span>
                                    )}
                                  {/* {formatMoneyPtBR(0)} */}
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(Number(serv.standard_value))}
                                </TableCell>
                                <TableCell align="center">
                                  {serv.standard_value ? (
                                    <CalcPerUnit
                                      control={controlService}
                                      index={index}
                                      price={Number(serv.standard_value)}
                                      name="service"
                                    />
                                  ) : (
                                    formatMoneyPtBR(0)
                                  )}
                                  {/* <CalcPerUnit
                                    control={controlService}
                                    index={index}
                                    price={Number(serv.standard_value)}
                                    name="service"
                                  /> */}
                                </TableCell>
                                <TableCell align="center">
                                  <ButtonRemoveItens
                                    onClick={() => handleRemoveService(serv.id)}
                                  >
                                    <DeleteIcon />
                                  </ButtonRemoveItens>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                {isEditingService && services.list.length > 0 && (
                  <Paper
                    sx={{
                      p: '0 2',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'transparent',
                    }}
                    elevation={0}
                  >
                    <Stack
                      direction="row"
                      alignSelf="flex-end"
                      spacing={2}
                      sx={{ width: 160 }}
                    >
                      <ButtonSubmit
                        variant="contained"
                        size="small"
                        type="submit"
                      >
                        salvar
                      </ButtonSubmit>
                      <ButtonSubmit
                        variant="contained"
                        size="small"
                        onClick={handleCancelServices}
                      >
                        cancelar
                      </ButtonSubmit>
                    </Stack>
                  </Paper>
                )}
              </Stack>

              {/* PEÇAS */}
              <Stack
                component="form"
                gap={1}
                onSubmit={handleSubmitProduct(onSubmitProduct)}
              >
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TitleCard sx={{ flex: 1 }}>Peças</TitleCard>
                    {/* <Box sx={{ marginRight: 1 }}>
                    <ButtonAddItens>
                      <AddIcon />
                    </ButtonAddItens>
                  </Box> */}

                    <MoreOptionsQuotation
                      aria-label="options to quotation"
                      disabledButton={!(products.list.length > 0)}
                      buttons={[
                        {
                          label: 'Editar',
                          action: handleIsEditingOptions,
                          type: 'product',
                        },
                      ]}
                    />
                  </Stack>
                  <DividerCard />
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Descrição</TableCell>
                          <TableCell align="center">QTD</TableCell>
                          <TableCell align="center">Desconto(UNID.)</TableCell>
                          <TableCell align="center">Valor</TableCell>
                          <TableCell align="center">Total</TableCell>
                          {isEditingProduct && (
                            <TableCell align="center">Ações</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!(
                          products.list.filter(
                            (s) =>
                              s.status === 'saved' || s.status === 'adding',
                          )?.length > 0
                        ) &&
                          !isEditingProduct && (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                align="center"
                                colSpan={isEditingProduct ? 7 : 6}
                                sx={{ paddingTop: 4 }}
                              >
                                Nenhuma peça cadastrada.
                              </TableCell>
                            </TableRow>
                          )}
                        {!(
                          products?.list.filter(
                            (s) =>
                              s.status === 'saved' || s.status === 'adding',
                          ).length > 0
                        ) &&
                          isEditingProduct && (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                align="center"
                                colSpan={isEditingService ? 7 : 6}
                                sx={{ paddingTop: 4 }}
                              >
                                Nenhuma peça cadastrada.
                              </TableCell>
                            </TableRow>
                          )}
                        {!isEditingProduct &&
                          products.list?.length > 0 &&
                          products.list.map((prod) => {
                            if (
                              prod.status === 'excluded' ||
                              prod.status === 'cancelled'
                            )
                              return null
                            return (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                                key={prod.id}
                              >
                                <TableCell align="left">
                                  {prod.product_code}
                                </TableCell>
                                <TableCell align="left">
                                  {prod.name ? prod.name : 'Não informado'}
                                </TableCell>
                                <TableCell align="center">
                                  {prod.quantity}
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(Number(prod.discount))}
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(Number(prod.sale_value))}
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(
                                    handleCalcValueTotalPerItem(
                                      Number(prod.sale_value),
                                      Number(prod.quantity),
                                      Number(prod.discount),
                                    ),
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        {isEditingProduct &&
                          products.list?.length > 0 &&
                          products.list.map((prod, index) => {
                            // setValueProduct(`product.${index}.id`, prod.id)
                            // setValueProduct(
                            //   `product.${index}.quantity`,
                            //   prod.quantity.replace('.', ','),
                            // )
                            // setValueProduct(
                            //   `product.${index}.discount`,
                            //   prod.discount.replace('.', ','),
                            // )
                            if (
                              prod.status === 'excluded' ||
                              prod.status === 'cancelled'
                            )
                              return null

                            return (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                                key={prod.id}
                              >
                                <TableCell align="left">
                                  {prod.product_code}
                                  {/* <InputTableForEdit.number
                                    control={controlProduct}
                                    name={`product.${index}.id`}
                                  /> */}
                                  <input
                                    type="text"
                                    readOnly={true}
                                    {...registerProduct(`product.${index}.id`)}
                                    // r={`product.${index}.id`}
                                    style={{
                                      display: 'none',
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  {prod.name ? prod.name : 'Não informado'}
                                </TableCell>
                                <TableCell align="center">
                                  <InputTableForEdit.number
                                    control={controlProduct}
                                    name={`product.${index}.quantity`}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <InputTableForEdit.money
                                    control={controlProduct}
                                    name={`product.${index}.discount`}
                                  />
                                  {errorsProduct.product &&
                                    // @ts-ignore
                                    errorsProduct.product[index] &&
                                    // @ts-ignore
                                    errorsProduct.product[index].message && (
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: 'red',
                                        }}
                                      >
                                        {/* @ts-ignore */}
                                        {errorsProduct.product[index].message}
                                      </span>
                                    )}
                                  {/* {formatMoneyPtBR(0)} */}
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(Number(prod.sale_value))}
                                </TableCell>
                                <TableCell align="center">
                                  {/* {formatMoneyPtBR(0)} */}
                                  {prod.sale_value ? (
                                    <CalcPerUnit
                                      control={controlProduct}
                                      index={index}
                                      price={Number(prod.sale_value)}
                                      name="product"
                                    />
                                  ) : (
                                    formatMoneyPtBR(0)
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  <ButtonRemoveItens
                                    onClick={() => handleRemoveProduct(prod.id)}
                                  >
                                    <DeleteIcon />
                                  </ButtonRemoveItens>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                {isEditingProduct && products.list.length > 0 && (
                  <Paper
                    sx={{
                      p: '0 2',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'transparent',
                    }}
                    elevation={0}
                  >
                    <Stack
                      direction="row"
                      alignSelf="flex-end"
                      spacing={2}
                      sx={{ width: 160 }}
                    >
                      <ButtonSubmit
                        variant="contained"
                        size="small"
                        type="submit"
                        onKeyDown={(event) =>
                          console.log('User pressed: ', event.key)
                        }
                      >
                        salvar
                      </ButtonSubmit>
                      <ButtonSubmit
                        variant="contained"
                        size="small"
                        onClick={handleCancelProducts}
                      >
                        cancelar
                      </ButtonSubmit>
                    </Stack>
                  </Paper>
                )}
              </Stack>

              {/* Kits */}

              <Stack
                // component="form"
                gap={1}
                // onSubmit={handleSubmit(onSubmitProduct)}
              >
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TitleCard sx={{ flex: 1 }}>Kits</TitleCard>

                    <MoreOptionsQuotation
                      aria-label="options to quotation"
                      disabledButton={!(kits.list.length > 0)}
                      buttons={[
                        {
                          label: 'Editar',
                          action: handleIsEditingOptions,
                          type: 'kit',
                        },
                      ]}
                    />
                  </Stack>
                  <DividerCard />
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Descrição</TableCell>
                          {isEditingKit && (
                            <TableCell align="center">Ações</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!(kits.list?.length > 0) && (
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell
                              align="center"
                              colSpan={isEditingProduct ? 7 : 6}
                              sx={{ paddingTop: 4 }}
                            >
                              Nenhuma Kit cadastrado.
                            </TableCell>
                          </TableRow>
                        )}
                        {/* {!isEditingKit && */}
                        {!isEditingKit &&
                          kits.list?.length > 0 &&
                          kits.list.map((k) => {
                            return (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                                key={k.kit_id}
                              >
                                <TableCell align="left">{k.kit_id}</TableCell>
                                <TableCell align="left">
                                  {k.name ? k.name : 'Não informado'}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        {/* {isEditingProduct &&
                          products.list?.length > 0 &&
                          products.list.map((prod, index) => {
                            setValueProduct(`product.${index}.id`, prod.id)
                            return (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                                key={prod.id}
                              >
                                <TableCell align="left">
                                  {prod.product_code}
                                </TableCell>
                                <TableCell align="left">
                                  {prod.name ? prod.name : 'Não informado'}
                                </TableCell>
                                <TableCell align="center">
                                  <InputTableForEdit.number
                                    control={controlProduct}
                                    name={`product.${index}.quantity`}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <InputTableForEdit.money
                                    control={controlProduct}
                                    name={`product.${index}.discount`}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {formatMoneyPtBR(Number(prod.sale_value))}
                                </TableCell>
                                <TableCell align="center">
                                  {prod.sale_value ? (
                                    <CalcPerUnit
                                      control={controlProduct}
                                      index={index}
                                      price={Number(prod.sale_value)}
                                      name="product"
                                    />
                                  ) : (
                                    formatMoneyPtBR(0)
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  <ButtonRemoveItens
                                    onClick={() => handleRemoveProduct(prod.id)}
                                  >
                                    <DeleteIcon />
                                  </ButtonRemoveItens>
                                </TableCell>
                              </TableRow>
                            )
                          })} */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                {isEditingProduct && products.list.length > 0 && (
                  <Paper
                    sx={{
                      p: '0 2',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'transparent',
                    }}
                    elevation={0}
                  >
                    <Stack
                      direction="row"
                      alignSelf="flex-end"
                      spacing={2}
                      sx={{ width: 160 }}
                    >
                      <ButtonSubmit
                        variant="contained"
                        size="small"
                        type="submit"
                      >
                        salvar
                      </ButtonSubmit>
                      <ButtonSubmit
                        variant="contained"
                        size="small"
                        onClick={() => setIsEditingProduct(false)}
                      >
                        cancelar
                      </ButtonSubmit>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Stack>
          </Grid>

          {/* cliente */}
          <Grid item xs={12} md={5} lg={5}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TitleCard>Cliente</TitleCard>
                  <MoreOptionsQuotation
                    aria-label="options to client"
                    buttons={[
                      {
                        label: 'Editar',
                        action: handleOpenModalEditClient,
                      },
                      {
                        label: 'Pesquisar',
                        action: handleOpenModalClientSearch,
                      },
                    ]}
                  />
                </Stack>
                <DividerCard />
                {client ? (
                  <List dense={false}>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Nome:</InfoCardName>{' '}
                      <InfoCardText>
                        {client?.name ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>
                        {client.cpf === null
                          ? 'Documento:'
                          : client.cpf === true
                          ? 'CPF:'
                          : 'CNPJ'}
                      </InfoCardName>{' '}
                      <InfoCardText>
                        {client?.document
                          ? formatCNPJAndCPFNumber(client?.document, client.cpf)
                          : 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    {client?.phone && client?.phone.length > 0 ? (
                      client?.phone.map((phone: string, index: number) => (
                        <ListItemCard
                          key={index + '-' + phone}
                          alignItems="flex-start"
                        >
                          <InfoCardName>Telefone:</InfoCardName>{' '}
                          <InfoCardText>{phone}</InfoCardText>
                        </ListItemCard>
                      ))
                    ) : (
                      <ListItemCard>
                        <InfoCardName>Telefone:</InfoCardName>{' '}
                        <InfoCardText width="100%">
                          {'Não informado'}
                        </InfoCardText>
                      </ListItemCard>
                    )}
                    {client?.email && client.email.length ? (
                      client?.email.map((email: string, index: number) => (
                        <ListItemCard
                          key={index + '-' + email}
                          alignItems="flex-start"
                        >
                          <InfoCardName>E-mail:</InfoCardName>{' '}
                          <InfoCardText>{email}</InfoCardText>
                        </ListItemCard>
                      ))
                    ) : (
                      <ListItemCard alignItems="flex-start">
                        <InfoCardName>E-mail:</InfoCardName>{' '}
                        <InfoCardText width="100%">
                          {'Não informado'}
                        </InfoCardText>
                      </ListItemCard>
                    )}
                    {client?.address && client?.address.length ? (
                      client?.address.map((address, index) => (
                        <ListItemCard
                          key={index + '-' + address}
                          alignItems="flex-start"
                        >
                          <InfoCardName>Endereço:</InfoCardName>{' '}
                          <InfoCardText>{address}</InfoCardText>
                        </ListItemCard>
                      ))
                    ) : (
                      <ListItemCard alignItems="flex-start">
                        <InfoCardName>Endereço:</InfoCardName>{' '}
                        <InfoCardText width="100%">
                          {'Não informado'}
                        </InfoCardText>
                      </ListItemCard>
                    )}
                  </List>
                ) : (
                  <Box
                    sx={{
                      with: '100%',
                      height: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                    }}
                  >
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                      sx={{
                        py: 10,
                      }}
                      component="form"
                      // onSubmit={handleSubmitClient(onSubmitClient)}
                    >
                      <Typography variant="h6">Adicione um Cliente</Typography>

                      <OutlinedInput
                        id="outlined-adornment-weight"
                        size="small"
                        placeholder="Digite um nome"
                        onClick={() => {
                          setOpenModalClientSearch(true)
                        }}
                        onKeyUp={(e) => {
                          if (e.code === 'Enter') {
                            setOpenModalClientSearch(true)
                          }
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="sbumit seach client"
                              edge="end"
                              onClick={() => {
                                setOpenModalClientSearch(true)
                              }}
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                        required
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                          'aria-label': 'weight',
                        }}
                      />
                    </Stack>
                  </Box>
                )}
              </Paper>
              {/* Veículo */}
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TitleCard>Veículo</TitleCard>
                  <MoreOptionsQuotation
                    aria-label="options to vehicle"
                    buttons={[
                      {
                        label: 'Editar',
                        action: handleOpenModalEditClientVehicle,
                      },
                      {
                        label: 'Pesquisar',
                        action: handleOpenModalClientVehicleSearch,
                      },
                    ]}
                  />
                </Stack>
                <DividerCard />
                {clientVehicle ? (
                  <List dense={false}>
                    <ListItemCard>
                      <InfoCardName>Marca:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.vehicle?.model?.brand?.name ??
                          'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Modelo:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.vehicle?.model?.name ?? 'Não informado'}{' '}
                        -{clientVehicle.vehicle.model_year ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Veículo:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.vehicle?.name ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Cor:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.color ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Chassi:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.chasis ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Placa:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.plate ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>KM:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.mileage ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                  </List>
                ) : (
                  <Box
                    sx={{
                      with: '100%',
                      height: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                    }}
                  >
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                      sx={{
                        py: 10,
                      }}
                      // onSubmit={handleSubmitClientVehicle(
                      //   onSubmitClientVehicle,
                      // )}
                    >
                      <Typography variant="h6">Adicione um Veículo</Typography>

                      <OutlinedInput
                        id="outlined-adornment-weight"
                        size="small"
                        placeholder="Digite um nome"
                        onClick={() => {
                          setOpenModalClientVehicleSearch(true)
                        }}
                        onKeyUp={(e) => {
                          if (e.code === 'Enter') {
                            setOpenModalClientVehicleSearch(true)
                          }
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="search submit"
                              edge="end"
                              onClick={() =>
                                setOpenModalClientVehicleSearch(true)
                              }
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                        required
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                          'aria-label': 'weight',
                        }}
                      />
                    </Stack>
                  </Box>
                )}
              </Paper>
              {/* RESUMO DO ORÇAMENTO */}
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TitleCard>RESUMO DO ORÇAMENTO</TitleCard>
                  <MoreOptionsQuotation
                    aria-label="options to quotation"
                    disabledButton
                    buttons={[
                      {
                        label: 'Editar',
                        action: handleIsEditingOptions,
                      },
                    ]}
                  />
                </Stack>
                <DividerCard />
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Descrição</TableCell>
                        <TableCell align="center">Preço</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="left">Valor dos itens:</TableCell>
                        <TableCell align="center">
                          {formatMoneyPtBR(products.total)}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="left">Descontos nos itens:</TableCell>
                        <TableCell align="center">
                          {formatMoneyPtBR(products.totalDiscount)}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="left">Valor dos Serviços:</TableCell>
                        <TableCell align="center">
                          {formatMoneyPtBR(services.total)}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="left">
                          Descontos dos serviços:
                        </TableCell>
                        <TableCell align="center">
                          {formatMoneyPtBR(services.totalDiscount)}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell
                          align="left"
                          sx={{
                            color: '#1C4961',
                            fontWeight: 'bold',
                          }}
                        >
                          Total de Bruto:
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: '#1C4961',
                            fontWeight: 'bold',
                          }}
                        >
                          {formatMoneyPtBR(products.total + services.total)}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell
                          align="left"
                          sx={{
                            color: '#1C4961',
                            fontWeight: 'bold',
                          }}
                        >
                          Total de descontos:
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: '#1C4961',
                            fontWeight: 'bold',
                          }}
                        >
                          {formatMoneyPtBR(
                            products.totalDiscount + services.totalDiscount,
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell
                          align="left"
                          sx={{
                            color: '#1C4961',
                            fontWeight: 'bold',
                          }}
                        >
                          Total de líquido:
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: '#1C4961',
                            fontWeight: 'bold',
                          }}
                        >
                          {formatMoneyPtBR(
                            products.total -
                              products.totalDiscount +
                              (services.total - services.totalDiscount),
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              <Grid item xs={12} md={12} lg={12} alignSelf="flex-end">
                <Paper
                  sx={{
                    p: '0 2',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'transparent',
                  }}
                  elevation={0}
                >
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <ButtonSubmit
                      variant="contained"
                      size="small"
                      onClick={() => onSave()}
                      disabled={client === null || clientVehicle === null}
                    >
                      salvar
                    </ButtonSubmit>
                    <ButtonSubmit
                      variant="contained"
                      size="small"
                      onClick={() => handleCancelled()}
                    >
                      cancelar
                    </ButtonSubmit>
                  </Stack>
                </Paper>
              </Grid>
            </Stack>
          </Grid>
          {actionAlerts !== null && (
            <ActionAlerts
              isOpen={actionAlerts.isOpen}
              title={actionAlerts.title}
              type={actionAlerts.type}
              handleAlert={handleAlert}
              redirectTo={
                actionAlerts.type === 'success' ? '/quotations' : undefined
              }
            />
          )}
        </Grid>
      </Container>

      <ModalSearchProduct
        handleClose={handleCloseModalSearchProduct}
        openMolal={openModalSearchProduct}
        handleAddProduct={handleAddProduct}
      />
      <ModalSearchService
        handleClose={handleCloseModalSearchServices}
        openMolal={openModalSearchServices}
        handleAddServices={handleAddServices}
      />

      <ModalSearchKit
        handleClose={handleCloseModalSearchKit}
        openMolal={openModalSearchKit}
        handleAddKit={handleAddKits}
      />

      <ModalSearchClient
        handleClose={handleCloseModalClienteSearch}
        openMolal={openModalClientSearch}
        handleAddClient={handleAddClient}
        handleOpenModalNewClient={handleOpenModalNewClient}
        dataClient={clientForModalSearch}
      />

      <ModalSearchClientVehicle
        handleClose={handleCloseModalClientVehicleSearch}
        openMolal={openModalClientVehicleSearch}
        handleAddClientVehicle={handleAddClientVehicle}
        handleOpenModalNewClientVehicle={handleOpenModalNewClientVehicle}
        dataVehicleCreated={clientVehicleCreated}
      />

      <ModalCreateNewClient
        isOpen={openModalNewClient}
        handleClose={handleCloseModalNewClient}
        handleSaveReturnClient={handleSaveReturnClient}
      />

      <ModalEditClient
        isOpen={openModalEditClient && !!client}
        handleClose={handleCloseModalEditClient}
        handleEditClient={handleEditClient}
        handleAddClient={handleAddClient}
        clientData={client}
      />

      <ModalCreateNewClientVehicle
        isOpen={openModalNewClientVehicle}
        handleClose={handleCloseModalNewClientVehicle}
        handleSaveReturnClientVehicle={handleSaveReturnClientVehicle}
      />

      <ModalCreateEditClientVehicle
        isOpen={openModalEditClientVehicle}
        handleClose={handleCloseModalEditClientVehicle}
        handleSaveEditClientVehicle={handleSaveEditClientVehicle}
        handleAddClientVehicle={handleAddClientVehicle}
        vehicleData={clientVehicle}
      />
    </>
  )
}

QuotationsCreate.auth = true
