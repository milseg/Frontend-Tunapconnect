import * as React from 'react'

import { useContext, useEffect, useState } from 'react'

import Container from '@mui/material/Container'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { useRouter } from 'next/router'

import List from '@mui/material/List'

import Stack from '@mui/material/Stack'

import {
  DividerCard,
  InfoCardName,
  InfoCardText,
  ListItemCard,
  TitleCard,
} from './styles'

import ActionAlerts from '@/components/ActionAlerts'
import { ActionAlertsStateProps } from '@/components/ActionAlerts/ActionAlerts'
import HeaderBreadcrumb from '@/components/HeaderBreadcrumb'
import { listBreadcrumb } from '@/components/HeaderBreadcrumb/types'

import { useQuery } from 'react-query'

import { CompanyContext } from '@/contexts/CompanyContext'

import { MoreOptionsServiceScheduleCreate } from './components/MoreOptionsServiceScheduleCreate'
import { Skeleton, Typography } from '@mui/material'

import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
import { ProductType } from '@/types/products'
import productsListRequests from '../../api/products.api'
// import { useForm } from 'react-hook-form'

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
  const [actionAlerts, setActionAlerts] =
    useState<ActionAlertsStateProps | null>(null)

  const router = useRouter()

  const { companySelected } = useContext(CompanyContext)
  const { serviceScheduleState, setServiceScheduleIsCreated } = useContext(
    ServiceScheduleContext,
  )

  const { data: dataProductDetail } = useQuery<ProductType>({
    queryKey: ['product_detail', router.query.id, companySelected],
    queryFn: productsListRequests.getProductsDetail,
    refetchOnWindowFocus: false,
    enabled: !!router.query.id,
  })

  // function handleCloseModalPrintInspectionDefault() {
  //   setOpenPrintInspectionModal(false)
  // }
  // function handleCheckListModelListModal() {
  //   setOpenCheckListModelListModal(false)
  // }
  function handleAlert(isOpen: boolean) {
    setActionAlerts({
      isOpen,
      title: '',
      type: 'success',
    })
  }

  useEffect(() => {
    // console.log('isCreated', serviceScheduleState)
    if (serviceScheduleState.serviceScheduleIsCreated) {
      console.log('isCreated')
      setActionAlerts({
        isOpen: true,
        title: 'Criado com sucesso!',
        type: 'success',
      })
      setServiceScheduleIsCreated(false)
    }
  }, [])

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <HeaderBreadcrumb
              data={HeaderBreadcrumbData}
              title="Detalhes do Produto"
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
                  <TitleCard>Empresa</TitleCard>
                  <MoreOptionsServiceScheduleCreate
                    aria-label="options to client"
                    buttons={[
                      {
                        label: 'Editar',
                      },
                    ]}
                  />
                </Stack>
                <DividerCard />
                {dataProductDetail ? (
                  <List dense={false}>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Nome:</InfoCardName>{' '}
                      <InfoCardText>
                        {dataProductDetail?.companie.name ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    {dataProductDetail?.companie.cnpj &&
                    dataProductDetail?.companie.cnpj.length > 0 ? (
                      <ListItemCard alignItems="flex-start">
                        <InfoCardName>CNPJ:</InfoCardName>{' '}
                        <InfoCardText>
                          {dataProductDetail?.companie.cnpj}
                        </InfoCardText>
                      </ListItemCard>
                    ) : (
                      <ListItemCard>
                        <InfoCardName>CNPJ:</InfoCardName>{' '}
                        <InfoCardText width="100%">
                          {'Não informado'}
                        </InfoCardText>
                      </ListItemCard>
                    )}
                    {dataProductDetail?.companie.id ? (
                      <ListItemCard alignItems="flex-start">
                        <InfoCardName>ID:</InfoCardName>{' '}
                        <InfoCardText>
                          {dataProductDetail?.companie.id}
                        </InfoCardText>
                      </ListItemCard>
                    ) : (
                      <ListItemCard alignItems="flex-start">
                        <InfoCardName>ID:</InfoCardName>{' '}
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
                      <InfoCardName>CNPJ:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>ID:</InfoCardName>{' '}
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
                  <TitleCard>Produto</TitleCard>
                  <MoreOptionsServiceScheduleCreate
                    aria-label="options to vehicle"
                    buttons={[
                      {
                        label: 'Editar',
                      },
                    ]}
                  />
                </Stack>
                <DividerCard />
                {dataProductDetail ? (
                  <List dense={false}>
                    <ListItemCard>
                      <InfoCardName>Nome:</InfoCardName>{' '}
                      <InfoCardText>
                        {dataProductDetail?.name ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Código do Produto:</InfoCardName>{' '}
                      <InfoCardText>
                        {dataProductDetail?.product_code ?? 'Não informado'}{' '}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Preço de venda:</InfoCardName>{' '}
                      <InfoCardText>
                        {dataProductDetail?.sale_value ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Preço de revenda:</InfoCardName>{' '}
                      <InfoCardText>
                        {dataProductDetail?.guarantee_value ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Código TUNAP:</InfoCardName>{' '}
                      <InfoCardText>
                        {dataProductDetail?.tunap_code ?? 'Não informado'}
                      </InfoCardText>
                    </ListItemCard>
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
                      <InfoCardName>Código do Produto:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Preço de venda:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Preço de revenda:</InfoCardName>{' '}
                      <InfoCardText sx={{ width: '100%' }}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: '1rem', width: '100%' }}
                        />
                      </InfoCardText>
                    </ListItemCard>
                    <ListItemCard alignItems="flex-start">
                      <InfoCardName>Código TUNAP:</InfoCardName>{' '}
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
                  <TitleCard>Responsável</TitleCard>
                  <MoreOptionsServiceScheduleCreate disabledButton />
                </Stack>
                <DividerCard />
                {dataProductDetail ? (
                  <List dense={false}>
                    <ListItemCard>
                      <InfoCardName>Nome:</InfoCardName>{' '}
                      <Typography>
                        {dataProductDetail?.responsible.username}
                      </Typography>
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Código responsável:</InfoCardName>{' '}
                      <InfoCardText>
                        {dataProductDetail?.responsible.id}
                      </InfoCardText>
                    </ListItemCard>
                  </List>
                ) : (
                  <List dense={false}>
                    <ListItemCard>
                      <InfoCardName>Nome:</InfoCardName>{' '}
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: '1rem', width: '100%' }}
                      />
                    </ListItemCard>
                    <ListItemCard>
                      <InfoCardName>Código responsável:</InfoCardName>{' '}
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: '1rem', width: '100%' }}
                      />
                    </ListItemCard>
                  </List>
                )}
              </Paper>
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
    </>
  )
}

ServiceSchedulesCreate.auth = true
