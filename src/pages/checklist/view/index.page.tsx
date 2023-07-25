import * as React from 'react'

import { useState } from 'react'

import Container from '@mui/material/Container'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import List from '@mui/material/List'

import Stack from '@mui/material/Stack'

import {
  ButtonOpenModalSearch,
  ButtonViewImage,
  DividerCard,
  InfoCardName,
  InfoCardText,
  ListItemCard,
  TitleCard,
} from './styles'

import { Box, Skeleton, Typography } from '@mui/material'

import { MoreOptionsServiceScheduleCreate } from '../../service-schedule/[id]/components/MoreOptionsServiceScheduleCreate'
import { GetServerSideProps } from 'next/types'
import axios from 'axios'
import { CheckListResponseAxios } from '@/types/checklist'
import { formatDateTime } from '@/ultis/formatDate'
import { Itens } from '../types'
import ModalInspectCar from './components/ModalInspectCar'
import { ModalImages } from './components/ModalImages'
// import ImageIcon from '@mui/icons-material/Image'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import { authOptions } from '@/pages/api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth/next'

interface ChecklistFactoryViewProps {
  data: CheckListResponseAxios
}

export default function ChecklistView({
  data: dataChecklist,
}: ChecklistFactoryViewProps) {
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

  function handleGetTextItem(item: Itens) {
    switch (item.rules.type) {
      case 'boolean':
        return item.values.value ? 'SIM' : 'NÃO'
      case 'select':
        return item.values.value === '-' || item.values.value === null
          ? 'Não informado'
          : item.values.value
      case 'visual_inspect':
        return null
      default:
        return 'Não informado'
    }
  }

  return (
    <>
      {dataChecklist && (
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
                  Agenda - {dataChecklist.service_schedule_id} / Checklist -{' '}
                  {dataChecklist.id}
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
                    {dataChecklist && dataChecklist?.client ? (
                      <List dense={false}>
                        <ListItemCard alignItems="flex-start">
                          <InfoCardName>Nome:</InfoCardName>{' '}
                          <InfoCardText>
                            {dataChecklist.client?.name ?? 'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        {dataChecklist.client?.email &&
                        dataChecklist.client.email.length ? (
                          dataChecklist.client?.email.map(
                            (email: string, index: number) => (
                              <ListItemCard
                                key={index + '-' + email}
                                alignItems="flex-start"
                              >
                                <InfoCardName>E-mail:</InfoCardName>{' '}
                                <InfoCardText>{email}</InfoCardText>
                              </ListItemCard>
                            ),
                          )
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
                    {dataChecklist.serviceschedule ? (
                      <List dense={false}>
                        <ListItemCard>
                          <InfoCardName>Número do checklist:</InfoCardName>{' '}
                          <InfoCardText>
                            {dataChecklist.service_schedule_id ??
                              'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        <ListItemCard>
                          <InfoCardName>Data Prometida:</InfoCardName>{' '}
                          <InfoCardText>
                            {formatDateTime(
                              dataChecklist.serviceschedule?.promised_date,
                            ) ?? 'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        <ListItemCard>
                          <InfoCardName>Responsável:</InfoCardName>{' '}
                          <InfoCardText>
                            {/* @ts-ignore */}
                            {dataChecklist?.technicalconsultant?.name ??
                              'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                      </List>
                    ) : (
                      <List dense={false}>
                        <ListItemCard alignItems="flex-start">
                          <InfoCardName>Número do checklist:</InfoCardName>{' '}
                          <InfoCardText sx={{ width: '100%' }}>
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: '1rem', width: '100%' }}
                            />
                          </InfoCardText>
                        </ListItemCard>
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
                    {dataChecklist.vehicleclient ? (
                      <List dense={false}>
                        <ListItemCard>
                          <InfoCardName>Marca:</InfoCardName>{' '}
                          <InfoCardText>
                            {/* @ts-ignore */}
                            {dataChecklist.brand?.name ?? 'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        <ListItemCard>
                          <InfoCardName>Modelo:</InfoCardName>{' '}
                          <InfoCardText>
                            {/* @ts-ignore */}
                            {dataChecklist.vehicleclient?.vehicle?.model
                              ?.name ?? 'Não informado'}{' '}
                            {/* @ts-ignore */}-
                            {dataChecklist.vehicleclient.vehicle.model_year ??
                              'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        <ListItemCard>
                          <InfoCardName>Veículo:</InfoCardName>{' '}
                          <InfoCardText>
                            {/* @ts-ignore */}
                            {dataChecklist.vehicleclient?.vehicle?.name ??
                              'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        <ListItemCard>
                          <InfoCardName>Cor:</InfoCardName>{' '}
                          <InfoCardText>
                            {dataChecklist.vehicleclient?.color ??
                              'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        <ListItemCard>
                          <InfoCardName>Chassi:</InfoCardName>{' '}
                          <InfoCardText>
                            {dataChecklist.vehicleclient?.chasis ??
                              'Não informado'}
                          </InfoCardText>
                        </ListItemCard>
                        <ListItemCard>
                          <InfoCardName>Placa:</InfoCardName>{' '}
                          <InfoCardText>
                            {dataChecklist.vehicleclient?.plate ??
                              'Não informado'}
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
                  {dataChecklist.stages.length > 0
                    ? dataChecklist.stages.map((stage, index) => {
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
                              // @ts-ignore
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
                                          aria-label={
                                            'Cliente Acompanha inspeção?'
                                          }
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
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                          >
                                            <Typography
                                              sx={{
                                                fontWeight: 'bold',
                                                fontSize: 18,
                                              }}
                                            >
                                              {handleGetTextItem(item)}
                                            </Typography>
                                            {/* @ts-ignore */}
                                            {item?.values?.images?.length >
                                              0 && (
                                              <ButtonViewImage
                                                aria-label="images"
                                                size="large"
                                                onClick={() => {
                                                  setOpenModalImages({
                                                    isOpen: true,
                                                    // @ts-ignore
                                                    listImages:
                                                      item.values.images
                                                        // @ts-ignore
                                                        ?.map((image) => {
                                                          return image.images
                                                        })[0]
                                                        // @ts-ignore
                                                        .map((i) => i.url),
                                                  })
                                                }}
                                              >
                                                {/* <ImageIcon /> */}
                                                <InsertPhotoOutlinedIcon />
                                              </ButtonViewImage>
                                            )}
                                          </Stack>
                                          {item.comment && (
                                            <>
                                              <Typography
                                                sx={{
                                                  textAlign: 'justify',
                                                  marginTop: 1,
                                                }}
                                              >
                                                Observação:
                                              </Typography>
                                              <Box
                                                sx={{
                                                  border:
                                                    '1px solid rgba(0, 0, 0, 0.2)',
                                                  borderRadius: '4px',
                                                  padding: 1,
                                                  marginTop: 1,
                                                }}
                                              >
                                                <Typography
                                                  sx={{
                                                    textAlign: 'justify',
                                                  }}
                                                >
                                                  {item.comment}
                                                </Typography>
                                              </Box>
                                            </>
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
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <ModalInspectCar
            isOpen={openModalInspectCar.isOpen}
            closeModalInspectCar={handleCloseModalInspectCar}
            data={dataChecklist.stages}
            stageName={openModalInspectCar.stageName}
            // @ts-ignore
          />
          <ModalImages
            isOpen={openModalImages.isOpen}
            closeModalImages={handleCloseModalImages}
            data={openModalImages.listImages}
          />
        </>
      )}
    </>
  )
}

ChecklistView.auth = false

export const getServerSideProps: GetServerSideProps<{
  data: CheckListResponseAxios | []
}> = async (context) => {
  const { query } = context

  const session = await getServerSession(context.req, context.res, authOptions)

  if (query.checklist_id && query.company_id && session?.user?.accessToken) {
    try {
      const res = await axios.get(
        `${process.env.APP_API_URL}/checklist/${query.checklist_id}?company_id=${query.company_id}`,
        {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
        },
      )

      return { props: { data: res.data.data } }
    } catch (e) {
      return {
        props: {
          data: null,
        },
      }
    }
  }
  return {
    props: {
      data: null,
    },
  }
}

// export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
//   const { 'next-auth.session-token': token } = parseCookies(ctx)

//   if (token) {
//     return {
//       redirect: {
//         destination: '/company',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {},
//   }
// }
