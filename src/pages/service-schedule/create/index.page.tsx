import * as React from 'react'

import { useContext, useEffect, useState } from 'react'

import Container from '@mui/material/Container'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search'

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
import { MoreOptionsServiceScheduleCreate } from './components/MoreOptionsServiceScheduleCreate'
import ModalEditClient from './components/ModalEditClient'
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material'
import ModalCreateEditClientVehicle from './components/ModalEditClientVehicle'
import ClaimServiceTable from './components/ClaimServiceTable'

import { formatCNPJAndCPF, formatCNPJAndCPFNumber } from '@/ultis/formatCNPJAndCPF'
import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
// import { useForm } from 'react-hook-form'

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

export default function ServiceSchedulesCreate() {
  const [client, setClient] = useState<ClientResponseType | null>(null)
  const [clientForModalSearch, setClientForModalSearch] =
    useState<ClientResponseType | null>(null)

  const [clientVehicleCreated, setClientVehicleCreated] =
    useState<ClientVehicleResponseType | null>(null)

  const [clientVehicle, setClientVehicle] =
    useState<ClientVehicleResponseType | null>()
  const [visitDate, setVisitDate] = useState<Dayjs | null>(dayjs(new Date()))
  const [technicalConsultant, setTechnicalConsultant] =
    useState<TechnicalConsultant | null>({
      id: 0,
      name: '-',
    })
  const [technicalConsultantsList, setTechnicalConsultantsList] = useState<
    TechnicalConsultant[]
  >([])

  const [actionAlerts, setActionAlerts] =
    useState<ActionAlertsStateProps | null>(null)
  const [openModalClientSearch, setOpenModalClientSearch] = useState(false)
  const [openModalClientVehicleSearch, setOpenModalClientVehicleSearch] =
    useState(false)
  const [claimServiceList, setClaimServiceList] =
    useState<ClaimServiceResponseType[]>([])
  const [openModalNewClient, setOpenModalNewClient] = useState(false)
  const [openModalEditClient, setOpenModalEditClient] = useState(false)
  const [openModalNewClientVehicle, setOpenModalNewClientVehicle] =
    useState(false)
  const [openModalEditClientVehicle, setOpenModalEditClientVehicle] =
    useState(false)
  const router = useRouter()

  const { companySelected } = useContext(CompanyContext)
  const { setServiceSchedule } = useContext(ServiceScheduleContext)

  // const {
  //   register: registerClient,
  //   handleSubmit: handleSubmitClient,
  //   reset: resetClient,
  // } = useForm({
  //   defaultValues: {
  //     searchClient: '',
  //   },
  // })
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

  function handleCancelled() {}

  function handleAlert(isOpen: boolean) {
    setActionAlerts({
      isOpen,
      title: '',
      type: 'success',
    })
  }

  function handleDateSchedule(data: Dayjs | null) {
    setVisitDate(data)
  }

  function handleRemoveClaimService(id: number) {
    setClaimServiceList(prevState => prevState.filter((c) => c.id !== id))
  }

  async function handleSaveClaimService(data: string) {
    console.log(data)
    try {
      const resp = await api.post('/claim-service', {
        company_id: companySelected,
        description: data
      })
      console.log(resp)
      const isClaimService = claimServiceList.findIndex(r => r.id === resp.data.data.id)
      if(isClaimService < 0) {
        setClaimServiceList(prevState => [...prevState, resp.data.data])
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
    const dataFormatted: updateData = {
      code: null,
      promised_date: formatDateTimeTimezone(`${visitDate}`),
      technical_consultant_id: technicalConsultant?.id,
      client_id: client?.id,
      client_vehicle_id: clientVehicle?.id,
      company_id: `${companySelected}`,
      plate: clientVehicle?.plate,
      claims_service: claimServiceList.map(c => ({ claim_service_id: c.id })) ?? [],
      checklist_version_id: 14,
    }

  

    try {
      const respCreate: any = await api.post('/service-schedule', dataFormatted)
      const idCreatedResponse = respCreate.data.data
      setServiceSchedule(idCreatedResponse, true)

      router.push('/service-schedule/' + idCreatedResponse.id)

      // setActionAlerts({
      //   isOpen: true,
      //   title: `${respCreate.data.msg ?? 'Salvo com sucesso!'}!`,
      //   type: 'success',
      // })
    } catch (e: any) {
      console.error(e)
      setActionAlerts({
        isOpen: true,
        title: `${e.response.data.msg ?? 'Error inesperado'}!`,
        type: 'error',
      })
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
            <HeaderBreadcrumb
              data={HeaderBreadcrumbData}
              title="Agenda de Serviços"
            />
          </Grid>
          <Grid item xs={12} md={7} lg={7}>
            <Stack spacing={3}>
              {/* cliente */}
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
                  <MoreOptionsServiceScheduleCreate
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
                      <InfoCardName>{client.cpf === null ? 'Documento:' : client.cpf === true? 'CPF:': 'CNPJ' }</InfoCardName>{' '}
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
                  <MoreOptionsServiceScheduleCreate
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
             
            </Stack>
          </Grid>

          <Grid item xs={12} md={5} lg={5}>
            <Stack spacing={3}>
              {/* Agendamento */}
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
                  <TitleCard>AGENDAMENTO</TitleCard>
                  <MoreOptionsServiceScheduleCreate disabledButton />
                </Stack>
                <DividerCard />
                <List dense={false}>
                  <ListItemCard>
                    <InfoCardName>Data da visita:</InfoCardName>

                    <DataTimeInput
                      dateSchedule={visitDate}
                      handleDateSchedule={handleDateSchedule}
                    />
                  </ListItemCard>
                </List>
              </Paper>
              {/* <Grid item xs={12} md={12} lg={12} alignSelf="flex-end">
                <Paper
                  sx={{
                    p: '0 2',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'transparent',
                  }}
                  elevation={0}
                ></Paper>
              </Grid> */}
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
                  <MoreOptionsServiceScheduleCreate
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
                  <TitleCard>Consultor técnico</TitleCard>
                  <MoreOptionsServiceScheduleCreate disabledButton />
                </Stack>
                <DividerCard />
                <List dense={false}>
                  <ListItemCard>
                    <InfoCardName>Nome:</InfoCardName>{' '}
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
                    <InfoCardName>Código consultor:</InfoCardName>{' '}
                    <InfoCardText>
                      {technicalConsultant?.id === 0
                        ? null
                        : technicalConsultant?.id}
                    </InfoCardText>
                  </ListItemCard>
                </List>
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
            />
          )}
        </Grid>
      </Container>

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

ServiceSchedulesCreate.auth = true
