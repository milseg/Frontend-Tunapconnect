/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
// @ts-nocheck
import { useForm } from 'react-hook-form'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Container,
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
import ActionAlerts from '@/components/ActionAlerts'
import { ButtonAdd, ButtonIcon, TableTitles } from './styles'

import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { ButtonPaginate } from '../service-schedule/create/styles'

import { ActionDeleteConfirmations } from '@/helpers/ActionConfirmations'
import { formatDateTime } from '@/ultis/formatDate'
import groupsListRequests from '../api/groups.api'
import theme from '@/styles/config/theme'
import { GroupsType } from '@/types/groups'
import { CustomNoRowsOverlay } from '@/components/TableApp/NoRows'

type SearchFormProps = {
  search: string
}

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

export default function Groups() {
  const [pageNumber, setPageNumber] = React.useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [actionAlerts, setActionAlerts] = useState<actionAlertsProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'))

  const queryClient = useQueryClient()
  const router = useRouter()

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
    data: groupsListDto,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['groupsList', pageNumber, router.query.nome],
    queryFn: groupsListRequests.getGroupsList,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // refetchOnReconnect: false,
    keepPreviousData: true,
  })

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      search: '',
    },
  })

  async function onSubmitSearch(data: SearchFormProps) {
    await router.push(
      `/groups?${data.search ? '&nome=' + data.search : ''}
     `,
    )
  }

  const handleCloseAlert = (isOpen: boolean) => {
    setActionAlerts((prevState) => ({
      ...prevState,
      isOpen,
    }))
  }
  const handleActiveAlert = (
    isOpen: boolean,
    type: 'success' | 'error' | 'warning',
    title: string,
  ) => {
    setActionAlerts({
      isOpen,
      title,
      type,
    })
  }

  const handleDelete = (id: number) => {
    refetch()
  }

  const handleEditGroup = async (selectId: number) => {
    await router.push(`/groups/edit/${selectId}`)
  }

  const handleDeleteAction = (selectId: number) => {
    ActionDeleteConfirmations(selectId, handleDelete, '/groups/')
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
                Grupos
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
                  {'Nome'}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Criado em'}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Atualizado em'}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Qtd de Empresas'}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '1.2rem' } }}>
                  {'Ação'}
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
                    }}
                  >
                    {groupsListDto &&
                      groupsListDto.groups.length > 0 &&
                      groupsListDto.groups.map((group: GroupsType, index) => (
                        <Stack
                          key={group.id_group}
                          direction="row"
                          sx={{
                            width: '100%',
                            backgroundColor: `${
                              index % 2 == 0 ? '#FFFFFF' : '#F1F1F1'
                            }`,
                            p: 1,
                            borderRadius: '2px',
                          }}
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="subtitle1"
                            color={'#1C4961'}
                            fontWeight={700}
                            sx={{ fontSize: { xs: '0.6rem', sm: '1.2rem' } }}
                            textOverflow={'ellipsis'}
                          >
                            {group.id_group}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color={'#1C4961'}
                            fontWeight={700}
                            sx={{
                              width: { xs: 'fit-content', sm: '40%' },
                              textAlign: 'center',
                              fontSize: { xs: '0.6rem', sm: '1.2rem' },
                            }}
                            textOverflow={'ellipsis'}
                          >
                            {group.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color={'#1C4961'}
                            fontWeight={700}
                            sx={{
                              width: { xs: 'fit-content', sm: '40%' },
                              textAlign: 'center',
                              fontSize: { xs: '0.6rem', sm: '1.2rem' },
                            }}
                            textOverflow={'ellipsis'}
                          >
                            {formatDateTime(group.created_at)}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color={'#1C4961'}
                            fontWeight={700}
                            sx={{
                              width: { xs: 'fit-content', sm: '40%' },
                              textAlign: 'center',
                              fontSize: { xs: '0.6rem', sm: '1.2rem' },
                            }}
                            textOverflow={'ellipsis'}
                          >
                            {formatDateTime(group.updated_at)}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color={'#1C4961'}
                            fontWeight={700}
                            sx={{
                              width: { xs: 'fit-content', sm: '40%' },
                              textAlign: 'center',
                              fontSize: { xs: '0.6rem', sm: '1.2rem' },
                            }}
                            textOverflow={'ellipsis'}
                          >
                            {group.qtd_empresas}
                          </Typography>
                          <Stack direction="row" sx={{ width: '15%' }}>
                            {/* <IconButton
                              aria-label="search"
                              color="warning"
                              onClick={() => handleDeleteAction(group.id_group)}
                              sx={{
                                marginLeft: 1,
                                color: 'red',
                                padding: { xs: '0rem', sm: '8px' },
                              }}
                            >
                              <Delete
                                sx={{
                                  width: { xs: '80%', sm: '100%' },
                                }}
                              />
                            </IconButton> */}
                            <IconButton
                              aria-label="search"
                              color="warning"
                              onClick={() => handleEditGroup(group.id_group)}
                              sx={{
                                marginLeft: 1,
                                color: 'blue',
                                padding: { xs: '0rem', sm: '8px' },
                              }}
                            >
                              <EditIcon
                                sx={{
                                  width: { xs: '80%', sm: '100%' },
                                }}
                              />
                            </IconButton>
                          </Stack>
                        </Stack>
                      ))}
                    {groupsListDto && groupsListDto.groups.length === 0 && (
                      <CustomNoRowsOverlay />
                    )}
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
              disabled={pageNumber === groupsListDto?.total_groups}
            >
              <ArrowForwardIosIcon />
            </ButtonPaginate>
          </Stack>
        </Stack>
      </Container>
      <ActionAlerts
        isOpen={actionAlerts.isOpen}
        title={actionAlerts.title}
        type={actionAlerts.type}
        handleAlert={handleCloseAlert}
      />
    </>
  )
}

Groups.auth = true
