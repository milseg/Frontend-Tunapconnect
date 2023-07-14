/* eslint-disable no-unused-vars */
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useContext, useState, useMemo, useEffect } from 'react'

import Container from '@mui/material/Container'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'

import { ButtonAdd, ButtonIcon } from './style'

import { api } from '@/lib/api'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { ActionDeleteConfirmations } from '@/helpers/ActionConfirmations'
import { useRouter } from 'next/router'
import { TableApp } from '@/components/TableApp'
import { CompanyContext } from '@/contexts/CompanyContext'
import { listBreadcrumb } from '@/components/HeaderBreadcrumb/types'
import HeaderBreadcrumb from '@/components/HeaderBreadcrumb'

import { useQuery } from 'react-query'
import Skeleton from '@mui/material/Skeleton'
import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
import ButtonFilterSelect from './components/ButtonFilterSelect'
import { Stack } from '@mui/system'
// import FilterListIcon from '@mui/icons-material/FilterList'
import { useMediaQuery, useTheme } from '@mui/material'
import { formatMoneyPtBR } from '@/ultis/formatMoneyPtBR'
import { QuotationResponseType } from '@/types/quotation'
import { QuotationsContext } from '@/contexts/QuotationContext'
import Link from 'next/link'

type SearchFormProps = {
  search: string
}

type QuotationListType = {
  id: number | string
  client: string
  plate: string
  chassis: string
  technical_consultant: string
  type_quotation: string
  discount: number | string
  total: number | string
}

type DataFetchProps = {
  paginate: {
    current_page: number
    total_pages: number
    total_results: number
  }
  quotationList: QuotationListType[] | []
  quotationListAllData: QuotationResponseType[]
}

type filterValuesProps = {
  date: {
    dateStart: string | null
    dateEnd: string | null
  }
}

const HeaderBreadcrumbData: listBreadcrumb[] = [
  {
    label: 'Tunap',
    href: '/company',
  },
  {
    label: 'Orçamentos',
    href: '/service-schedules/list',
  },
]

export default function QuotationList() {
  const [pages, setPages] = useState<{
    next: boolean
    previous: boolean
  }>({ next: true, previous: true })
  const [filterValues, setFilterValues] = useState<filterValuesProps>()
  const [isMobile, setIsMobile] = useState(false)

  const { companySelected } = useContext(CompanyContext)
  const { setQuotations } = useContext(QuotationsContext)

  const router = useRouter()

  const theme = useTheme()
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'))

  useEffect(() => {
    if (!isWeb) {
      if (!isMobile) {
        setIsMobile(true)
      }
    } else {
      setIsMobile(false)
    }
  }, [isWeb])

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      search: '',
    },
  })

  async function onSubmitSearch(data: SearchFormProps) {
    await router.push(
      `/quotations?company_id=${companySelected}${
        data.search ? '&search=' + data.search : ''
      }
     `,
    )
  }

  const handleDelete = (id: number) => {
    refetch()
  }

  let url = `/quotations?company_id=${companySelected}`

  if (router.query.limit) {
    url += `&limit=${router.query.limit}`
  }

  if (router.query.current_page) {
    url += `&current_page=${router.query.current_page}`
  }

  if (router.query.search) {
    url += `&search=${router.query.search}`
  }

  // if (router.query.promised_date_min) {
  //   url += `&promised_date_min=${filterValues?.date.dateStart}`
  // }
  // if (router.query.promised_date_max) {
  //   url += `&promised_date_max=${filterValues?.date.dateEnd}`
  // }
  // if (router.query.orderby) {
  //   url += '&orderby=promised_date'
  // }

  async function handleFilterValues(values: filterValuesProps) {
    setFilterValues(values)
    if (values?.date.dateStart) {
      url += `&promised_date_min=${values?.date.dateStart}`
    }
    if (values?.date.dateEnd) {
      url += `&promised_date_max=${values?.date.dateEnd}`
    }
    url += '&orderby=promised_date'

    await router.push(url)
  }
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Número',
        headerClassName: 'super-app-theme--header',
        width: 80,
        type: 'number',
        align: 'center',
        sortable: false,
      },
      {
        field: 'client',
        headerName: 'Cliente',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        maxWidth: 230,
        minWidth: 120,
        align: 'left',
        sortable: false,
      },
      {
        field: 'plate',
        headerName: 'Placa',
        headerClassName: 'super-app-theme--header',
        width: 100,
        sortable: false,
      },
      {
        field: 'chassis',
        headerName: 'Chassi',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        maxWidth: 240,
        minWidth: 130,
        sortable: false,
      },
      {
        field: 'technical_consultant',
        headerName: 'Responsavél',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        maxWidth: 200,
        minWidth: 120,
        sortable: false,
      },
      {
        field: 'type_quotation',
        headerName: 'Tipo',
        headerClassName: 'super-app-theme--header',
        width: 150,
        type: 'text',
        align: 'left',
        sortable: false,
      },
      {
        field: 'discount',
        headerName: 'Desconto',
        headerClassName: 'super-app-theme--header',
        width: 120,
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => {
          return `${formatMoneyPtBR(params.row.discount) || ''}`
        },
      },
      {
        field: 'total',
        headerName: 'Total',
        headerClassName: 'super-app-theme--header',
        width: 120,
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => {
          return `${formatMoneyPtBR(params.row.total) || ''}`
        },
      },

      {
        field: 'action',
        headerName: 'Ação',
        headerClassName: 'super-app-theme--header',
        sortable: false,
        width: 90,
        align: 'left',
        renderCell: (params: GridRenderCellParams) => {
          const onClick = (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation()
            const id = params.id
            ActionDeleteConfirmations(
              id as number,
              handleDelete,
              '/quotations/',
            )
          }
          return (
            <IconButton
              aria-label="search"
              color="warning"
              onClick={onClick}
              sx={{ marginLeft: 1, color: 'red' }}
            >
              <Delete />
            </IconButton>
          )
        },
      },
    ],
    [],
  )

  const {
    data: rows,
    isSuccess,
    // isInitialLoading,
    // isLoading,
    // isFetched,
    refetch,
    isFetching,
  } = useQuery<DataFetchProps>(
    ['quotation-list', companySelected, url],
    () => {
      return api.get(url).then((response) => {
        console.log(response)
        const resp = response.data.data.map((data: any) => {
          return {
            id: data?.id ?? 'Não informado',
            client: data?.client?.name ?? 'Não informado',
            plate: data?.client_vehicle?.plate ?? 'Não informado',
            chassis: data?.client_vehicle?.chasis ?? 'Não informado',
            technical_consultant:
              data?.technical_consultant?.name ?? 'Não informado',
            type_quotation: data?.os_type?.name ?? 'não definido',
            discount: data?.TotalGeralDesconto ?? 'não definido',
            total: data?.TotalGeral ?? 'não definido',
          }
        })

        if (response.data.total_pages === 1)
          setPages({
            next: false,
            previous: false,
          })
        if (!router.query.current_page) {
          if (response.data.current_page === 1) {
            setPages((prevState) => ({ ...prevState, previous: false }))
          }
        }

        return {
          paginate: {
            current_page: response.data.current_page,
            total_pages: response.data.total_pages,
            total_results: response.data.total_results,
          },
          quotationList: resp,
          quotationListAllData: response.data.data,
        }
      })
    },

    {
      enabled: !!companySelected || !!url,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  )

  function handlePages(nextPage: any): void {
    let newCurrent_page = 1
    const actualCurrent_page = router.query.current_page
      ? parseInt(router.query.current_page as string)
      : 1

    if (!rows?.paginate) {
      return
    }

    if (nextPage === 'next') {
      newCurrent_page = actualCurrent_page + 1
      if (newCurrent_page > rows?.paginate.total_pages) {
        return
      }
    }
    if (nextPage === 'back') {
      newCurrent_page = actualCurrent_page - 1
      if (newCurrent_page < 1) {
        return
      }
    }

    const newUrlPagination = `/quotations?company_id=${companySelected}${
      router.query.search ? '&search=' + router.query.search : ''
    }${'&current_page=' + newCurrent_page}${
      router.query.limit ? '&limit=' + router.query.limit : ''
    }`

    router.push(newUrlPagination)
  }

  async function handleSetServiceSchedule(idSelected: number) {
    const filterSelected = rows?.quotationListAllData.filter(
      (i) => i.id === idSelected,
    )[0]

    if (filterSelected) {
      setQuotations(filterSelected)
    }
    // await router.push(`/service-schedule/${idSelected}`)
  }

  useEffect(() => {
    async function refetchUrl() {
      if (router.query.search) {
        setValue('search', router.query.search as string)
      } else {
        setValue('search', '')
      }

      if (router.query.current_page) {
        const currentPage = parseInt(router.query.current_page as string)
        if (rows?.paginate) {
          if (currentPage >= rows?.paginate.total_pages) {
            setPages({
              next: false,
              previous: true,
            })
          } else {
            if (pages.next === false) {
              setPages((prevState) => ({ ...prevState, next: true }))
            }
          }
          if (currentPage <= 1) {
            setPages({
              next: true,
              previous: false,
            })
          } else {
            if (pages.previous === false) {
              setPages((prevState) => ({ ...prevState, previous: true }))
            }
          }
        }
      }

      await refetch()
    }
    refetchUrl()
  }, [router])
  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <HeaderBreadcrumb data={HeaderBreadcrumbData} title="Orçamentos" />
            {!isMobile ? (
              <Link href={'/quotations/create'}>
                <ButtonAdd
                  size="large"
                  variant="contained"
                  sx={{ alignSelf: 'flex-end', marginRight: '20px' }}
                  startIcon={<AddCircleOutlineIcon />}
                  // onClick={async () => {
                  //   await router.push(`/service-schedule/create`)
                  // }}
                  // disabled
                >
                  novo
                </ButtonAdd>
              </Link>
            ) : (
              <Link href={'/quotations/create'}>
                <ButtonIcon
                  sx={{ alignSelf: 'flex-end', marginRight: '20px' }}
                  onClick={async () => {
                    // await router.push(`/service-schedule/create`)
                  }}
                >
                  <AddCircleOutlineIcon />
                </ButtonIcon>
              </Link>
            )}
          </Stack>
          {/* <Grid
                item
                xs={}
                // md={12}
                // lg={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              > */}

          {/* </Grid> */}
        </Grid>

        <Grid item xs={12} sx={{ marginBottom: 2 }}></Grid>
        <Grid item xs={12} sx={{ marginBottom: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmitSearch)}
                  sx={{ flexWrap: 'nowrap', display: 'flex', flex: 1 }}
                >
                  <TextField
                    label="Procura"
                    id="outlined-size-small"
                    size="small"
                    sx={{ flex: 1, width: '100%' }}
                    {...register('search')}
                  />

                  <ButtonIcon
                    type="submit"
                    aria-label="search"
                    color="primary"
                    sx={{ marginLeft: 1 }}
                  >
                    <SearchIcon />
                  </ButtonIcon>
                </Box>
                <Box>
                  <ButtonFilterSelect
                    handleFilterValues={handleFilterValues}
                    isMobile={isMobile}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {!isFetching ? (
            <TableApp
              columns={columns}
              rowsData={isSuccess ? rows.quotationList : []}
              handlePages={handlePages}
              pages={pages}
              loading={isFetching}
              companyId={companySelected}
              handleSetServiceSchedule={handleSetServiceSchedule}
            />
          ) : (
            <Skeleton variant="rounded" sx={{ width: '100%' }} height={150} />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

QuotationList.auth = true
