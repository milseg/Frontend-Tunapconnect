import { ReactNode, SyntheticEvent, useContext, useRef, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { LinkNext, TabItem, TabsContainer, Title } from './styles'
import TabContent from './TabContent'
import { ApiCore } from '@/lib/api'
import { Backdrop, CircularProgress, Skeleton } from '@mui/material'
import { ChecklistProps, StagesDataProps } from '../types'

import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ActionAlerts from '@/components/ActionAlerts'
import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
import { ChecklistModelType } from '@/types/checklist'

// import { useForm } from 'react-hook-form'

// type InspectionCarDataType = {
//   name: string
//   url_image: string
//   value: {
//     id: number
//     type: 'amassado' | 'riscado' | 'quebrado' | 'faltando' | 'none'
//     positions: {
//       web: {
//         top: number
//         left: number
//       }
//       mobile: {
//         top: number
//         left: number
//       }
//     }
//   }[]
//   comment: string
//   images: {
//     id: number
//     name: string
//     url: string
//     size: string
//   }[]
// }

// type CheckListSignatures = {
//   name: string
//   rules: {
//     required: boolean
//   }
//   image: string[]
// }

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

interface RefTabContentRefType {
  handleOpenAlertDialog: (value: number) => void
  handleGetValuesForm: () => Promise<StagesDataProps>
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export type ActionAlertsStateProps = {
  isOpen: boolean
  title: string
  type: 'error' | 'warning' | 'success'
  redirectTo?: string | undefined
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ position: 'relative' }}>{children}</Box>}
    </div>
  )
}

export default function ChecklistCreateById() {
  const [painelValue, setPainelValue] = useState(0)
  // const [typeSubmitForm, setTypeSubmitForm] = useState<
  //   'salvo' | 'finalizado' | 'rascunho'
  // >('rascunho')

  const [actionAlerts, setActionAlerts] = useState<ActionAlertsStateProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const api = new ApiCore()
  const router = useRouter()
  const { serviceScheduleState, setCheckListModel, setServiceSchedule } =
    useContext(ServiceScheduleContext)

  const tabContentRef = useRef<RefTabContentRefType>(null)

  const updateChecklistMutations = useMutation(
    (newDataChecklist: ChecklistProps) => {
      setLoading(true)
      return api.create(`/checklist`, newDataChecklist).then((resp) => {
        setTimeout(() => {
          setLoading(false)
        }, 3000)
        return resp.data.data[0]
      })
    },

    {
      onSuccess: (data) => {
        // queryClient.invalidateQueries({ queryKey: ['checklist-createByID'] })
        // queryClient.setQueryData(['checklist-createByID'], data)
        setActionAlerts({
          isOpen: true,
          title: 'Salvo com sucesso',
          type: 'success',
        })
        queryClient.invalidateQueries('checklist-createByID')
        return data
      },
      onError: (err: any) => {
        setActionAlerts({
          isOpen: true,
          title: 'Salvo com sucesso',
          type: 'error',
        })
        console.log(err)
      },
    },
  )

  const { data, isSuccess, isLoading, isFetching } =
    useQuery<ChecklistModelType>(
      ['checklist-createByID'],
      async () => {
        try {
          if (!serviceScheduleState.serviceSchedule) {
            const resp = await api.get(
              `/service-schedule/${router?.query?.service_schedule_id}`,
            )
            setServiceSchedule(resp.data.data)
          }
          if (serviceScheduleState.checklistModel) {
            return serviceScheduleState.checklistModel
          } else {
            const resp = await api.get(`/checklist_model/list`)
            if (resp.data.data.length > 0) {
              const isExistChecklistModel = resp.data.data.filter(
                (item: any) =>
                  item.id === Number(router.query.checklist_model_id),
              )[0]
              if (isExistChecklistModel) {
                setCheckListModel(isExistChecklistModel)
                return isExistChecklistModel
              }
            }
          }
          // setCheckList
          // console.log({ company_id: '5', service_schedule_id: '2301' })
          // if (serviceScheduleState.checklist) {
          //   return serviceScheduleState.checklist
          // }

          // const resp = await api.get(`/checklist/${router?.query?.checklist_model_id}`)
          // setCheckList(resp.data.data)
          return []
        } catch (error) {
          console.log(error)
        }
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled:
          !!router?.query?.checklist_model_id &&
          !!router?.query?.service_schedule_id,
      },
    )
  const { serviceSchedule, checklistModel } = serviceScheduleState

  // console.log(checklistModel)

  function handleAlert(isOpen: boolean) {
    setActionAlerts((previState) => ({
      ...previState,
      isOpen,
    }))
  }

  async function handleAddListCheckList(stageData: StagesDataProps) {
    const isFinalizedArray = checklistModel?.stages.map((item) => {
      if (item.name === stageData.name) {
        return stageData.status
      }

      return item.status
    })
    const isFinalized = isFinalizedArray?.every((item) => item === 'finalizado')

    const dataForPost = {
      company_id: serviceSchedule?.company_id,
      brand_id: serviceSchedule?.client_vehicle.vehicle.brand_id,
      vehicle_id: serviceSchedule?.client_vehicle.vehicle.id,
      model_id: serviceSchedule?.client_vehicle.vehicle.model_id, // verificar
      vehicle_client_id: serviceSchedule?.client_vehicle.id,
      km: serviceSchedule?.client_vehicle.mileage,
      fuel: null,
      client_id: serviceSchedule?.client_id,
      service_schedule_id: serviceSchedule?.id,
      checklist_model: checklistModel?.id,
      status: isFinalized ? 'finalizado' : 'pendente',
      stages: checklistModel?.stages.map((item) => {
        // if (item.name === stageData.name) {
        //   return {
        //     ...stageData,
        //     status: typeSubmitForm,
        //   }
        // }

        return item.name === stageData.name ? stageData : item
      }),
    }

    // @ts-ignore
    updateChecklistMutations.mutate(dataForPost)
  }

  const handleChange = async (event: SyntheticEvent, newValue: number) => {
    // console.log(newValue)
    // if (data?.stages[value].status !== 'finalizado') setValue(newValue)
    // if (tabContentRef.current && tabContentRef.current.handleOpenAlertDialog) {
    //   tabContentRef.current.handleOpenAlertDialog(newValue)
    // }
    if (tabContentRef.current && tabContentRef.current.handleGetValuesForm) {
      const result = await tabContentRef.current.handleGetValuesForm()
      console.log(result)
      // @ts-ignore
      const removedStageActual: StagesDataProps[] =
        checklistModel?.stages.filter((item) => item.name !== result.name)

      const newChecklist = {
        ...checklistModel,
        stages: [...removedStageActual, result],
      }
      setCheckListModel(newChecklist as ChecklistModelType)
    }
    setPainelValue(newValue)
  }

  function handleChangeTabContent(newValue: number) {
    setPainelValue(newValue)
  }
  // useEffect(() => {
  //   console.log(router.query)

  //   if (data?.stages) {
  //     if (data?.stages.length > 0) {
  //       sessionStorage.setItem(
  //         `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${router.query.id}`,
  //         JSON.stringify(data?.stages),
  //       )
  //     }
  //   }
  // }, [])
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ borderRadius: 2 }}
        />
      </Container>
    )
  }

  if (isSuccess) {
    // console.log(data)
    return (
      <>
        <Box sx={{ mt: 2, ml: 2 }}>
          <LinkNext
            href={`/service-schedule/${router.query.service_schedule_id}`}
          >
            <Title variant="h6">
              Agenda:{serviceSchedule?.id} -{' '}
              {serviceSchedule?.client?.name ?? 'Não informado'}
            </Title>
          </LinkNext>
        </Box>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, display: 'flex', flexDirection: 'column', pb: 1 }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TabsContainer
                    value={painelValue}
                    onChange={handleChange}
                    textColor="inherit"
                    centered
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                  >
                    {data && data?.stages?.length > 0
                      ? data.stages.map((stage, index) => {
                          // const isDisabled = stage.status === 'finalizado'
                          return (
                            <TabItem
                              key={stage.name + Math.random() * 2000}
                              label={stage.name}
                              {...a11yProps(index)}
                              // disabled={isDisabled}
                            />
                          )
                        })
                      : null}
                  </TabsContainer>
                </Box>
                {data && data?.stages?.length > 0
                  ? data.stages.map((stage, index) => {
                      return (
                        <TabPanel
                          key={`${Math.random() * 2000}-${stage.name}-${index}`}
                          value={painelValue}
                          index={index}
                        >
                          <TabContent
                            stageItems={stage.itens}
                            stageData={stage}
                            ref={tabContentRef}
                            // checklistModel={data}
                            stageName={stage.name}
                            formIDSubmit={`form-${stage.name}-${index}`}
                            handleAddListCheckList={handleAddListCheckList}
                            isClosed={stage.status === 'finalizado'}
                            handleChangeTabContent={handleChangeTabContent}
                          />
                        </TabPanel>
                      )
                    })
                  : null}
              </Paper>
              <Grid
                item
                xs={12}
                justifyContent="flex-end"
                sx={{
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  alignContent: 'center',
                }}
              ></Grid>
            </Grid>
          </Grid>
        </Container>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={() => {}}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <ActionAlerts
          isOpen={actionAlerts?.isOpen && !isFetching}
          title={'salvo'}
          type={'success'}
          handleAlert={handleAlert}
        />
      </>
    )
  }
}

ChecklistCreateById.auth = true
