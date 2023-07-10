import * as React from 'react'

import { useState } from 'react'

import Container from '@mui/material/Container'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import List from '@mui/material/List'

import Stack from '@mui/material/Stack'

import {
  ButtonOpenModalSearch,
  DividerCard,
  InfoCardName,
  InfoCardText,
  ListItemCard,
  TitleCard,
} from './styles'

import { Skeleton, Typography } from '@mui/material'

import { MoreOptionsServiceScheduleCreate } from '../service-schedule/[id]/components/MoreOptionsServiceScheduleCreate'
import { GetServerSideProps } from 'next/types'
import axios from 'axios'
import { CheckListResponseAxios } from '@/types/checklist'
import { formatDateTime } from '@/ultis/formatDate'
import { Itens } from '../checklist/types'
import ModalInspectCar from './components/ModalInspectCar'
import { ModalImages } from './components/ModalImages'

interface ChecklistFactoryViewProps {
  data: CheckListResponseAxios
}

export default function ChecklistFactoryView({
  data,
}: ChecklistFactoryViewProps) {
  console.log(data)

  const [openModalInspectCar, setOpenModalInspectCar] = useState<{
    isOpen: boolean
    stageName: string
  }>({
    isOpen: false,
    stageName: '',
  })
  const [openModalImages, setOpenModalImages] = useState<{
    isOpen: boolean
    listImages: string[]
  }>({
    isOpen: false,
    listImages: [],
  })

  function handleCloseModalInspectCar() {
    setOpenModalInspectCar({
      isOpen: false,
      stageName: '',
    })
  }
  function handleCloseModalImages() {
    setOpenModalImages({
      isOpen: false,
      listImages: [],
    })
  }

  const { client, vehicleclient: clientVehicle, serviceschedule, stages } = data

  function handleGetTextItem(item: Itens) {
    switch (item.rules.type) {
      case 'boolean':
        return item.values.value ? 'SIM' : 'NÃO'
      case 'select':
        return item.values.value === '-' ? 'Não informado' : item.values.value
      case 'visual_inspect':
        return null
      default:
        return 'Não informado'
    }
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sx={{
              background: '#1C4961',
              marginLeft: 2,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'center',
              paddingBottom: 2,
            }}
          >
            <Typography
              sx={{
                color: '#fff',
              }}
              variant="h6"
            >
              Agenda
            </Typography>

            {/* <HeaderBreadcrumb
              data={HeaderBreadcrumbData}
              title="Agenda de Serviços"
            /> */}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
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
                    disabledButton
                    aria-label="options to client"
                    buttons={
                      [
                        // {
                        //   label: 'Editar',
                        //   action: handleOpenModalEditClient,
                        // },
                        // {
                        //   label: 'Pesquisar',
                        //   action: handleOpenModalClientSearch,
                        // },
                      ]
                    }
                  />
                </Stack>
                <DividerCard />
                {data.client ? (
                  <List dense={false}>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Nome:</InfoCardName>{' '}
                      <InfoCardText>
                        {client?.name ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
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
                  </List>
                ) : (
                  <List dense={false}>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Nome:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>

                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>E-mail:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                  </List>
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
                  <TitleCard>Agenda</TitleCard>
                  <MoreOptionsServiceScheduleCreate
                    aria-label="options to vehicle"
                    disabledButton
                    buttons={
                      [
                        // {
                        //   label: 'Editar',
                        //   action: handleOpenModalEditClientVehicle,
                        // },
                        // {
                        //   label: 'Pesquisar',
                        //   action: handleOpenModalClientVehicleSearch,
                        // },
                      ]
                    }
                  />
                </Stack>
                <DividerCard />
                {clientVehicle ? (
                  <List dense={false}>
                    <ListItemCard>
                      <InfoCardName>Data Prometida:</InfoCardName>{' '}
                      <InfoCardText>
                        {formatDateTime(serviceschedule?.promised_date) ??
                          'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Responsável:</InfoCardName>{' '}
                      <InfoCardText>
                        {serviceschedule?.technical_consultant_id ??
                          'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                  </List>
                ) : (
                  <List dense={false}>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Data Prometida:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Responsável:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                  </List>
                )}
              </Paper>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Stack spacing={3}>
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
                    disabledButton
                    buttons={
                      [
                        // {
                        //   label: 'Editar',
                        //   action: handleOpenModalEditClientVehicle,
                        // },
                        // {
                        //   label: 'Pesquisar',
                        //   action: handleOpenModalClientVehicleSearch,
                        // },
                      ]
                    }
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
                    {/* <ListItemCard>
                      <InfoCardName>KM:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.mileage ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard> */}
                  </List>
                ) : (
                  <List dense={false}>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Marca:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Modelo:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Veículo:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Cor:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Chassi:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Placa:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    {/* <ListItemCard alignItems="flex-start">
                      <InfoCardName>KM:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard> */}
                  </List>
                )}
              </Paper>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Grid container spacing={2}>
              {stages.length > 0
                ? stages.map((stage, index) => {
                    return (
                      <React.Fragment
                        key={`${index} - ${Math.random() * 20000000}`}
                      >
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          sx={{
                            background: '#1C4961',
                            color: '#FFFFFF',
                            marginLeft: 2,
                            marginTop: 2,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            // justifyContent: 'center',
                            paddingBottom: 2,
                          }}
                        >
                          {stage.name}
                        </Grid>
                        {stage?.itens.length > 0 &&
                          stage.itens.map((item, index) => {
                            return (
                              <Grid
                                item
                                xs={12}
                                md={4}
                                lg={4}
                                key={`${index} - ${Math.random() * 200000}`}
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
                                    justifyContent="space-between"
                                  >
                                    <TitleCard>{item.name}</TitleCard>
                                    <MoreOptionsServiceScheduleCreate
                                      disabledButton
                                      aria-label={'Cliente Acompanha inspeção?'}
                                      buttons={
                                        [
                                          // {
                                          //   label: 'Editar',
                                          //   action: handleOpenModalEditClient,
                                          // },
                                          // {
                                          //   label: 'Pesquisar',
                                          //   action: handleOpenModalClientSearch,
                                          // },
                                        ]
                                      }
                                    />
                                  </Stack>
                                  <DividerCard />
                                  {handleGetTextItem(item) !== null ? (
                                    <>
                                      <Typography
                                        sx={{
                                          fontWeight: 'bold',
                                          fontSize: 18,
                                        }}
                                      >
                                        {handleGetTextItem(item)}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          marginTop: 2,
                                          textAlign: 'justify',
                                        }}
                                      >
                                        {item.comment}
                                      </Typography>
                                      {/* @ts-ignore */}
                                      {item?.values?.images?.length > 0 && (
                                        <ButtonOpenModalSearch
                                          sx={{
                                            width: 90,
                                            marginTop: 2,
                                          }}
                                          onClick={
                                            () => {}
                                            // setOpenModalImages({
                                            //   isOpen: true,
                                            //   listImages: item.values.images
                                            //     ?.map((image) => {
                                            //       console.log(image.images)
                                            //       return image.images
                                            //     })
                                            //     .map((item) => {
                                            //       console.log(item)
                                            //     }),
                                            // })
                                          }
                                        >
                                          imagens
                                        </ButtonOpenModalSearch>
                                      )}
                                    </>
                                  ) : (
                                    <ButtonOpenModalSearch
                                      sx={{
                                        width: 100,
                                      }}
                                      onClick={() =>
                                        setOpenModalInspectCar({
                                          isOpen: true,
                                          stageName: stage.name,
                                        })
                                      }
                                    >
                                      visualizar
                                    </ButtonOpenModalSearch>
                                  )}
                                </Paper>
                              </Grid>
                            )
                          })}
                      </React.Fragment>
                    )
                  })
                : null}
              {/* <Grid item xs={12} md={4} lg={4}>
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
                    <TitleCard>Cliente Acompanha inspeção?</TitleCard>
                    <MoreOptionsServiceScheduleCreate
                      disabledButton
                      aria-label={'Cliente Acompanha inspeção?'}
                      buttons={
                        [
                          // {
                          //   label: 'Editar',
                          //   action: handleOpenModalEditClient,
                          // },
                          // {
                          //   label: 'Pesquisar',
                          //   action: handleOpenModalClientSearch,
                          // },
                        ]
                      }
                    />
                  </Stack>
                  <DividerCard />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
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
                    <TitleCard>Cliente Acompanha inspeção?</TitleCard>
                    <MoreOptionsServiceScheduleCreate
                      disabledButton
                      aria-label={'Cliente Acompanha inspeção?'}
                      buttons={
                        [
                          // {
                          //   label: 'Editar',
                          //   action: handleOpenModalEditClient,
                          // },
                          // {
                          //   label: 'Pesquisar',
                          //   action: handleOpenModalClientSearch,
                          // },
                        ]
                      }
                    />
                  </Stack>
                  <DividerCard />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
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
                    <TitleCard>Cliente Acompanha inspeção?</TitleCard>
                    <MoreOptionsServiceScheduleCreate
                      disabledButton
                      aria-label={'Cliente Acompanha inspeção?'}
                      buttons={
                        [
                          // {
                          //   label: 'Editar',
                          //   action: handleOpenModalEditClient,
                          // },
                          // {
                          //   label: 'Pesquisar',
                          //   action: handleOpenModalClientSearch,
                          // },
                        ]
                      }
                    />
                  </Stack>
                  <DividerCard />
                </Paper>
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <ModalInspectCar
        isOpen={openModalInspectCar.isOpen}
        closeModalInspectCar={handleCloseModalInspectCar}
        data={stages}
        stageName={openModalInspectCar.stageName}
        // @ts-ignore
      />
      <ModalImages
        isOpen={openModalImages.isOpen}
        closeModalImages={handleCloseModalImages}
        data={openModalImages.listImages}
      />
    </>
  )
}

ChecklistFactoryView.auth = false

export const getServerSideProps: GetServerSideProps<{
  data: CheckListResponseAxios | []
}> = async () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdHVuYXBjb25uZWN0LWFwaS5oZXJva3VhcHAuY29tL2FwaS9sb2dpbiIsImlhdCI6MTY4OTAxNjA0NSwiZXhwIjoxNjg5MTAyNDQ1LCJuYmYiOjE2ODkwMTYwNDUsImp0aSI6InFpTTF2T21OclNtaFp3dmwiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyIsInVzZXJuYW1lIjoibWNvbnRyZXJhcyIsIm5hbWUiOiJNaWd1ZWwgQ29udHJlcmFzIiwiaWQiOjEsImVtYWlsIjoibWlndWVsam9zZWNvbnRyZXJhc0BnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InRlc3RlIiwidHVuYXBfcGVybWlzc2lvbiI6W119.y5OVg6uh2Csjx9qa6Nl0LxkK5-Bo-sTH3L08pwuvCxI'

  try {
    const res = await axios.get(
      `${process.env.APP_API_URL}/checklist/${582}?company_id=5`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return { props: { data: res.data.data } }
  } catch (e) {
    return { props: { data: null } }
  }
}
