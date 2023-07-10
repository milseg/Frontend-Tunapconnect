/* eslint-disable no-unused-vars */
// @ts-nocheck
import * as React from 'react'

import { useState } from 'react'

import Container from '@mui/material/Container'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import List from '@mui/material/List'

import Stack from '@mui/material/Stack'

import {
  DividerCard,
  InfoCardName,
  InfoCardText,
  ListItemCard,
  TitleCard,
} from './styles'

import { listBreadcrumb } from '@/components/HeaderBreadcrumb/types'

import { Skeleton, Typography } from '@mui/material'

import { MoreOptionsServiceScheduleCreate } from '../service-schedule/[id]/components/MoreOptionsServiceScheduleCreate'

// import { useForm } from 'react-hook-form'

export default function ChecklistFactoryView() {
  const [client, setClient] = useState(null)

  const [clientVehicle, setClientVehicle] = useState(null)

  // const { data: dataServiceSchedule, status: dataServiceScheduleStatus } =
  //   useQuery({
  //     queryKey: ['checklist-factory-view', 'by_id', 'view'],
  //     queryFn: async () => {
  //       const { id } = router.query
  //       if (serviceScheduleState.serviceSchedule) {
  //         return serviceScheduleState.serviceSchedule
  //       } else {
  //         const resp = await api.get(`/service-schedule/${id}`)
  //         setServiceSchedule(resp.data.data)
  //         return resp.data.data
  //       }
  //     },
  //     // refetchOnMount: true,
  //     refetchOnWindowFocus: false,
  //     enabled: !!router.query.id,
  //   })

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
              background: '#004D3F',
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
                {client ? (
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
                        {clientVehicle?.vehicle?.model?.brand?.name ??
                          'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Responsável:</InfoCardName>{' '}
                      <InfoCardText>
                        {clientVehicle?.vehicle?.model?.name ?? 'Não informado'}{' '}
                        -{clientVehicle.vehicle.model_year ?? 'Não informado'}
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
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

ChecklistFactoryView.auth = false
