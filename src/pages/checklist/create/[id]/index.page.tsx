import { ReactNode, SyntheticEvent, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { TabItem, TabsContainer } from './styles'
import TabContent from './TabContent'
import { ApiCore } from '@/lib/api'
import { Skeleton } from '@mui/material'
import {
  ChecklistProps,
  ReponseGetCheckList,
  StagesDataProps,
} from '../../types'

import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ActionAlerts from '@/components/ActionAlerts'
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
  const queryClient = useQueryClient()
  const api = new ApiCore()
  const router = useRouter()

  const updateChecklistmutations = useMutation(
    (newDataChecklist: ChecklistProps) => {
      return api
        .update(`/checklist/${router?.query?.id}`, newDataChecklist)
        .then((resp) => {
          console.log(resp.data.data)
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
        queryClient.invalidateQueries({ queryKey: ['checklist-createByID'] })
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

  const { data, isSuccess, isLoading } = useQuery<ReponseGetCheckList>(
    ['checklist-createByID'],
    () =>
      api
        .get(`/checklist/${router?.query?.id}?company_id=`)
        .then((response) => {
          return response.data.data
        }),
    {
      refetchOnWindowFocus: false,
      enabled: !!router?.query?.id,
    },
  )

  function handleAlert(isOpen: boolean) {
    setActionAlerts((previState) => ({
      ...previState,
      isOpen,
    }))
  }

  // function handleSaveFormSubmit(data: InspectionCarDataType[]) {
  //   console.log(data)
  //   setInspectionCarData(data)
  // }

  // function handleSaveInspectionCarData(data: InspectionCarDataType[]) {
  //   setInspectionCarData(data)
  // }
  // function handleSaveSignatures(signatures: CheckListSignatures[]) {
  //   console.log(signatures)
  //   // setInspectionCarData(data)
  // }

  async function handleAddListCheckList(stageData: StagesDataProps) {
    const dataForPost = {
      company_id: data?.company_id,
      brand_id: data?.brand_id,
      vehicle_id: data?.vehicle_id,
      model_id: data?.vehicle, // verificar
      vehicle_client_id: data?.vehicle_client_id,
      km: data?.km,
      fuel: data?.fuel,
      client_id: data?.client_id,
      service_schedule_id: data?.service_schedule_id,
      checklist_model: data?.checklist_model,
      status: 'pendente',
      stages: data?.stages.map((item) => {
        // if (item.name === stageData.name) {
        //   return {
        //     ...stageData,
        //     status: typeSubmitForm,
        //   }
        // }

        return item.name === stageData.name ? stageData : item
      }),
    }

    console.log(dataForPost)
    // @ts-ignore
    updateChecklistmutations.mutate(dataForPost)
  }

  const handleChange = async (event: SyntheticEvent, newValue: number) => {
    // console.log(newValue)
    // if (data?.stages[value].status !== 'finalizado') setValue(newValue)
    setPainelValue(newValue)
  }

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                    {data?.stages?.length > 0 &&
                      data.stages.map((stage, index) => {
                        // const isDisabled = stage.status === 'finalizado'
                        return (
                          <TabItem
                            key={stage.name + Math.random() * 2000}
                            label={stage.name}
                            {...a11yProps(index)}
                            // disabled={isDisabled}
                          />
                        )
                      })}
                  </TabsContainer>
                </Box>
                {data?.stages?.length > 0 &&
                  data.stages.map((stage, index) => {
                    return (
                      <TabPanel
                        key={`${Math.random() * 2000}-${stage.name}-${index}`}
                        value={painelValue}
                        index={index}
                      >
                        <TabContent
                          stageItems={stage.itens}
                          stageData={stage}
                          checklistModel={data}
                          stageName={stage.name}
                          formIDSubmit={`form-${stage.name}-${index}`}
                          handleAddListCheckList={handleAddListCheckList}
                          isClosed={stage.status === 'finalizado'}
                        />
                      </TabPanel>
                    )
                  })}
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
              >
                {/* <Stack direction="row" spacing={2}>
                  <MyButton
                    type="submit"
                    variant="contained"
                    form={`form-${
                      data?.stages[painelValue].name ?? ''
                    }-${painelValue}`}
                    onClick={() => setTypeSubmitForm('salvo')}
                  >
                    Salvar
                  </MyButton>
                  <MyButton
                    type="submit"
                    variant="contained"
                    form={`form-${
                      data?.stages[painelValue].name ?? ''
                    }-${painelValue}`}
                    onClick={() => {
                      console.log(inspectionCarData)
                      setTypeSubmitForm('finalizado')
                    }}
                  >
                    Finalizar
                  </MyButton>
                </Stack> */}
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <ActionAlerts
          isOpen={actionAlerts?.isOpen}
          title={'salvo'}
          type={'success'}
          handleAlert={handleAlert}
        />
      </>
    )
  }
}

ChecklistCreateById.auth = true
