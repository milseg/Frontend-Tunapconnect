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
import {
  ButtonAdd,
  ButtonIcon,
  CustomLabel,
  FormUpdate,
  SearchButton,
  TableTitles,
  UploadFileField,
} from './styles'

import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { IFileProps } from '@/types/upload-file'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { ButtonPaginate } from '../service-schedule/create/styles'
import uploadFileRequests from '../api/uploadFile.api'
import { apiB } from '@/lib/api'
import { Loading } from '@/components/Loading'
import { useUploadContext } from '@/contexts/UploadContext'
import { ActionDeleteConfirmations } from '@/helpers/ActionConfirmations'

import { formatDateTime } from '@/ultis/formatDate'
import Link from 'next/link'
import groupsListRequests from '../api/groups.api'
import theme from '@/styles/config/theme'
import { GroupsType, IGroupsEditDTO } from '@/types/groups'
import { Delete } from '@mui/icons-material'

type SearchFormProps = {
  search: string
}

export default function Groups() {
  const [pageNumber, setPageNumber] = React.useState(1)
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [editNameId, setEditNameId] = useState<number>()
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'))

  const queryClient = useQueryClient()
  const router = useRouter()
  const handleCloseDialogEdit = () => {
    setOpen(false)
  }

  React.useEffect(() => {
    if (!isWeb) {
      if (!isMobile) {
        setIsMobile(true)
      }
    } else {
      setIsMobile(false)
    }
    console.log(filesListDTO)
  }, [isWeb])

  const {
    data: filesListDTO,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['groupsList', pageNumber, router.query.search],
    queryFn: groupsListRequests.getGroupsList,
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
      `/grupos?${data.search ? '&search=' + data.search : ''}
     `,
    )
  }

  const handleFormEdit = async (event: any) => {
    event.preventDefault()
    const response = await apiB.put<IGroupsEditDTO>(`/grupos/${editNameId}`, {
      name: newName,
    })
    if (response.status === 200) {
      refetch()
      setOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    refetch()
  }

  const handleDeleteAction = (selectId: number) => {
    ActionDeleteConfirmations(selectId, handleDelete, '/groups/')
  }

  const openDialogEdit = (selectId: number) => {
    setOpen(true)
    setEditNameId(selectId)
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
                    {filesListDTO &&
                      filesListDTO.groups.length > 0 &&
                      filesListDTO.groups.map((group: GroupsType, index) => (
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
                              width: '40%',
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
                              width: '40%',
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
                              width: '40%',
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
                              width: '40%',
                              textAlign: 'center',
                              fontSize: { xs: '0.6rem', sm: '1.2rem' },
                            }}
                            textOverflow={'ellipsis'}
                          >
                            {group.qtd_empresas}
                          </Typography>
                          <Stack direction="row">
                            <IconButton
                              aria-label="search"
                              color="warning"
                              onClick={() => handleDeleteAction(group.id_group)}
                              sx={{ marginLeft: 1, color: 'red' }}
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              aria-label="search"
                              color="warning"
                              onClick={() => openDialogEdit(group.id_group)}
                              sx={{ marginLeft: 1, color: 'blue' }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Stack>
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
              disabled={pageNumber === filesListDTO?.total_groups}
            >
              <ArrowForwardIosIcon />
            </ButtonPaginate>
          </Stack>
        </Stack>
        <Dialog open={open} onClose={handleCloseDialogEdit}>
          <DialogTitle>Editar Nome</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Para editar o nome do grupo, insira o nome novo no campo abaixo
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nove nome"
              type="email"
              fullWidth
              variant="standard"
              onInput={(e: any) => setNewName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogEdit}>Cancelar</Button>
            <Button type="submit" onClick={handleFormEdit}>
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  )
}

Groups.auth = true
