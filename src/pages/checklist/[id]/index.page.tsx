import {
  ReactNode,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { LinkNext, TabItem, TabsContainer, Title } from './styles'
import TabContent from './TabContent'
import { api } from '@/lib/api'
import { Backdrop, CircularProgress, Skeleton } from '@mui/material'
import { ChecklistProps, StagesDataProps } from '../types'

import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ActionAlerts from '@/components/ActionAlerts'
import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'

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

  const router = useRouter()

  const {
    serviceScheduleState,
    setCheckList,
    setServiceScheduleIsCreated,
    setServiceSchedule,
  } = useContext(ServiceScheduleContext)

  const tabContentRef = useRef<RefTabContentRefType>(null)

  const updateChecklistMutations = useMutation(
    (newDataChecklist: ChecklistProps) => {
      setLoading(true)
      return api
        .put(`/checklist/${newDataChecklist.id}`, newDataChecklist)
        .then((resp) => {
          setActionAlerts({
            isOpen: true,
            title: 'Salvo com sucesso',
            type: 'success',
          })
          return resp.data.data[0]
        })
    },

    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('checklist-createByID')
        setLoading(false)
        setActionAlerts({
          isOpen: true,
          title: 'Salvo com sucesso',
          type: 'error',
        })
        return data
      },
      onError: () => {
        setActionAlerts({
          isOpen: true,
          title: 'Error ao salvar',
          type: 'error',
        })
      },
    },
  )

  const { data, isSuccess, isLoading, isFetching } = useQuery<ChecklistProps>(
    ['checklist-createByID'],
    async () => {
      try {
        if (serviceScheduleState.checklist) {
          return serviceScheduleState.checklist
        } else {
          const respChecklist = await api.get(`/checklist/${router?.query?.id}`)
          if (!serviceScheduleState.serviceSchedule) {
            const respServiceSchedule = await api.get(
              `/service-schedule/${respChecklist.data.data.service_schedule_id}`,
            )
            setServiceSchedule(respServiceSchedule.data.data)
          }

          setCheckList(respChecklist.data.data)

          return respChecklist.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!router?.query?.id,
    },
  )
  const { checklist } = serviceScheduleState

  function handleAlert(isOpen: boolean) {
    setActionAlerts((previState) => ({
      ...previState,
      isOpen,
    }))
  }

  async function handleAddListCheckList(stageData: StagesDataProps) {
    const isFinalizedArray = checklist?.stages.map((item) => {
      if (item.name === stageData.name) {
        return stageData.status
      }

      return item.status
    })
    const isFinalized = isFinalizedArray?.every((item) => item === 'finalizado')

    const dataForPost = {
      ...checklist,
      status: isFinalized ? 'finalizado' : 'pendente',

      stages: checklist?.stages.map((item) => {
        return item.name === stageData.name ? stageData : item
      }),
    }

    // @ts-ignore
    setCheckList(dataForPost as ChecklistProps)
    // @ts-ignore
    updateChecklistMutations.mutate(dataForPost)
  }

  const handleChange = async (event: SyntheticEvent, newValue: number) => {
    if (tabContentRef.current && tabContentRef.current.handleGetValuesForm) {
      const result = await tabContentRef.current.handleGetValuesForm()

      // @ts-ignore
      const removedStageActual: ChecklistProps[] = checklist?.stages.filter(
        (item) => item.name !== result.name,
      )

      const newChecklist = {
        ...checklist,
        stages: [...removedStageActual, result],
      }
      // @ts-ignore
      setCheckList(newChecklist as ChecklistProps)
    }

    setPainelValue(newValue)
  }

  function handleChangeTabContent(newValue: number) {
    setPainelValue(newValue)
  }

  useEffect(() => {
    console.log('isCreated ---', serviceScheduleState.serviceScheduleIsCreated)
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
    return (
      <>
        <Box sx={{ mt: 2, ml: 2 }}>
          <LinkNext
            href={`/service-schedule/${checklist?.service_schedule_id}`}
          >
            <Title variant="h6">
              Agenda:{checklist?.service_schedule_id} -{' '}
              {serviceScheduleState.serviceSchedule?.client?.name ??
                'Não informado'}
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
