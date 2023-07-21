/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import * as React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import { ButtonAdd, ButtonIcon, TableTitles } from './styles'

import { useState, useContext } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { ButtonPaginate } from '../service-schedule/create/styles'
import { apiB } from '@/lib/api'
import { Loading } from '@/components/Loading'
import { ActionDeleteConfirmations } from '@/helpers/ActionConfirmations'
import { formatDateTime } from '@/ultis/formatDate'
import groupsListRequests from '../api/groups.api'
import theme from '@/styles/config/theme'
import { GroupsType, IGroupsEditDTO } from '@/types/groups'
import { Delete } from '@mui/icons-material'
import { CustomNoRowsOverlay } from '@/components/TableApp/NoRows'
import productsListRequests from '../api/products.api'
import { CompanyContext } from '@/contexts/CompanyContext'
import { ProductType } from '@/types/products'

type SearchFormProps = {
  search: string
}

export default function Products() {
  const [pageNumber, setPageNumber] = React.useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'))
  const { companySelected } = useContext(CompanyContext)

  const queryClient = useQueryClient()
  const router = useRouter()

  const exampleReturn = [
    { id: 1, guarantee_value: 20, sale_value: 40, tunap_code: 'teste' },
    { id: 2, guarantee_value: 20, sale_value: 40, tunap_code: 'teste' },
    { id: 3, guarantee_value: 20, sale_value: 40, tunap_code: 'teste' },
    { id: 4, guarantee_value: 20, sale_value: 40, tunap_code: 'teste' },
    { id: 5, guarantee_value: 20, sale_value: 40, tunap_code: 'teste' },
  ]

  React.useEffect(() => {
    if (!isWeb) {
      if (!isMobile) {
        setIsMobile(true)
      }
    } else {
      setIsMobile(false)
    }
  }, [isWeb])

  const {
    data: productsListDto,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['productsList', pageNumber, router.query.nome, companySelected],
    queryFn: productsListRequests.getProductsList,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
  })

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      search: '',
    },
  })

  async function onSubmitSearch(data: SearchFormProps) {
    await router.push(
      `/produtos?${data.search ? '&nome=' + data.search : ''}
     `,
    )
  }

  const handleDelete = (id: number) => {
    refetch()
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2, p: 1 }}>
        <Stack direction="column" spacing={4}>
          <Stack direction="column" spacing={2}>
            <Grid
              container
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Typography
                component="h2"
                fontWeight={700}
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                Produtos
              </Typography>
              {!isMobile ? (
                <ButtonAdd
                  size="large"
                  variant="contained"
                  sx={{ alignSelf: 'flex-end', marginRight: '20px' }}
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={async () => {
                    // await router.push(`/service-schedule/create`)
                  }}
                  // disabled
                >
                  novo
                </ButtonAdd>
              ) : (
                <ButtonIcon
                  sx={{ alignSelf: 'flex-end', marginRight: '20px' }}
                  onClick={async () => {
                    // await router.push(`/service-schedule/create`)
                  }}
                >
                  <AddCircleOutlineIcon />
                </ButtonIcon>
              )}
            </Grid>
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
                    {/* <Box>
                  <ButtonFilterSelect
                    handleFilterValues={handleFilterValues}
                    isMobile={isMobile}
                  />
                </Box> */}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Stack>
          <Stack
            direction="column"
            justifyContent="flex-start"
            spacing={{ xs: 1, sm: 2 }}
            sx={{ width: '100%' }}
          >
            <TableTitles>
              <Stack
                direction="row"
                sx={{ width: '100%' }}
                justifyContent="space-between"
              >
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Número'}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Código Tunap'}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Valor de revenda'}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Valor de venda'}
                </Typography>
              </Stack>
            </TableTitles>
            {isFetching ? (
              <Skeleton variant="rounded" sx={{ width: '100%' }} height={150} />
            ) : (
              <Paper
                sx={{
                  p: { xs: 0, sm: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'fit-content',
                }}
              >
                {isFetching ? (
                  <Skeleton
                    variant="rounded"
                    sx={{ width: '100%' }}
                    height={150}
                  />
                ) : (
                  <Paper
                    sx={{
                      p: { xs: 0, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'fit-content',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {exampleReturn.map((product: ProductType, index) => (
                      <Stack
                        key={product.id}
                        direction="row"
                        sx={{
                          width: '100%',
                          backgroundColor: `${
                            index % 2 == 0 ? '#FFFFFF' : '#F1F1F1'
                          }`,
                          p: 1,
                          borderRadius: '2px',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          color={'#1C4961'}
                          fontWeight={700}
                          sx={{ fontSize: { xs: '0.5rem', sm: '1.2rem' } }}
                          textOverflow={'ellipsis'}
                        >
                          {product.id}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color={'#1C4961'}
                          fontWeight={700}
                          sx={{
                            width: 'fit-content',
                            textAlign: 'center',
                            fontSize: { xs: '0.5rem', sm: '1.2rem' },
                          }}
                          textOverflow={'ellipsis'}
                        >
                          {product.tunap_code}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color={'#1C4961'}
                          fontWeight={700}
                          sx={{
                            width: 'fit-content',
                            textAlign: 'center',
                            fontSize: { xs: '0.5rem', sm: '1.2rem' },
                          }}
                          textOverflow={'ellipsis'}
                        >
                          {product.guarantee_value}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color={'#1C4961'}
                          fontWeight={700}
                          sx={{
                            width: 'fit-content',
                            textAlign: 'center',
                            fontSize: { xs: '0.5rem', sm: '1.2rem' },
                          }}
                          textOverflow={'ellipsis'}
                        >
                          {product.sale_value}
                        </Typography>
                      </Stack>
                    ))}
                  </Paper>
                )}
              </Paper>
            )}
          </Stack>
          <Stack
            direction="row"
            sx={{ width: '100%' }}
            alignItems="center"
            justifyContent="center"
            display="flex"
            columnGap="12px"
          >
            <ButtonPaginate
              type="submit"
              disableRipple
              onClick={() => setPageNumber((pageNumber) => pageNumber - 1)}
              disabled={pageNumber === 1}
            >
              <ArrowBackIosNewIcon />
            </ButtonPaginate>
            <ButtonPaginate
              type="submit"
              disableRipple
              onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
              disabled={pageNumber === productsListDto?.total_groups}
            >
              <ArrowForwardIosIcon />
            </ButtonPaginate>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}

Products.auth = true
