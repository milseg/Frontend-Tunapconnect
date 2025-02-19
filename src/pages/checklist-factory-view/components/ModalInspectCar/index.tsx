import {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Tab,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  ButtonCancel,
  ButtonMarkup,
  ClickableArea,
  ContainerButtonsInformation,
  ContainerClickableArea,
  ContainerInformation,
  TabsContainer,
  TextAreaField,
  Title,
} from './styles'
import { InspectionDropzone } from './DropZone'

import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'

import { StagesDataProps } from '@/pages/checklist/types'

type markupTypesEnum = 'amassado' | 'riscado' | 'quebrado' | 'faltando' | 'none'

interface TabPanelProps {
  children?: ReactNode
  dir?: string
  index: number
  value: number
}

interface imageData {
  id: number
  name: string
  url: string
  size: string
}

interface imagemList {
  frente: imageData[]
  lateralEsquerdo: imageData[]
  lateralDireito: imageData[]
  traseira: imageData[]
  teto: imageData[]
}

type MarkupType = {
  id: number
  type: markupTypesEnum
  positions: {
    web: {
      top: number
      left: number
    }
    mobile: {
      top: number
      left: number
    }
  }
}

const markupTagTypes: { [key: string]: string } = {
  amassado: 'A',
  riscado: 'R',
  quebrado: 'Q',
  faltando: 'F',
}

type MarkupListType = {
  frente: MarkupType[]
  lateralEsquerdo: MarkupType[]
  lateralDireito: MarkupType[]
  traseira: MarkupType[]
  teto: MarkupType[]
}
type ObservationsType = {
  frente: string
  lateralEsquerdo: string
  lateralDireito: string
  traseira: string
  teto: string
}
type ImgPositionCarUrlType = {
  frente: string
  lateralEsquerdo: string
  lateralDireito: string
  traseira: string
  teto: string
}

type positionsTypes =
  | 'frente'
  | 'lateralEsquerdo'
  | 'lateralDireito'
  | 'traseira'
  | 'teto'

export type getValuesInspectionReturnType = {
  name: string
  url_image: string
  value: MarkupType[]
  comment: string
  images: imageData[]
  screenShot: string
}[]

interface ModalInspectCarProps {
  isOpen: boolean
  closeModalInspectCar: () => void
  data: StagesDataProps[]
  stageName: string
}

const positionsCar: Array<positionsTypes> = [
  'frente',
  'lateralEsquerdo',
  'lateralDireito',
  'traseira',
  'teto',
]

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <ContainerClickableArea>{children}</ContainerClickableArea>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

export function ModalInspectCar({
  isOpen,
  closeModalInspectCar,
  data,
  stageName,
}: ModalInspectCarProps) {
  const theme = useTheme()
  const [tabsValue, setTabsValue] = useState(0)

  const [markups, setMarkups] = useState<MarkupListType>({
    frente: [],
    lateralEsquerdo: [],
    lateralDireito: [],
    traseira: [],
    teto: [],
  })
  const [listImagesUpload, setListImagesUpload] = useState<imagemList>({
    frente: [],
    lateralEsquerdo: [],
    lateralDireito: [],
    traseira: [],
    teto: [],
  })
  const [observations, setObservations] = useState<ObservationsType>({
    frente: '',
    lateralEsquerdo: '',
    lateralDireito: '',
    traseira: '',
    teto: '',
  })
  const [imgPositionCarUrl, setImgPositionCarUrl] =
    useState<ImgPositionCarUrlType>({
      frente: '',
      lateralEsquerdo: '',
      lateralDireito: '',
      traseira: '',
      teto: '',
    })

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const containerImageCarFrenteRef = useRef(null)
  const containerImageCarTraseiraRef = useRef(null)
  const containerImageCarLateralEsquerdaRef = useRef(null)
  const containerImageCarLateralDireitaRef = useRef(null)
  const containerImageCarTetoRef = useRef(null)

  const handleChange = async (event: SyntheticEvent, newValue: number) => {
    setTabsValue(newValue)
  }

  const handleClose = () => {
    closeModalInspectCar()
  }

  // function getClickCoords(event: any) {
  //   const e = event.target
  //   const dim = e.getBoundingClientRect()
  //   const x = event.clientX - dim.left
  //   const y = event.clientY - dim.top
  //   return [x, y]
  // }

  // const removeMarkup = (id: number) => {
  //   setMarkups((prevState) => {
  //     return {
  //       ...prevState,
  //       [positionsCar[tabsValue]]: prevState[positionsCar[tabsValue]].filter(
  //         (m) => {
  //           return m.id !== id
  //         },
  //       ),
  //     }
  //   })
  // }

  // async function addMarkup(event: any) {
  //   const [x, y] = getClickCoords(event)
  //   const positionTop = y
  //   const positionLeft = x
  //   if (!Object.hasOwn(markupTagTypes, markupValue)) {
  //     return
  //   }

  //   const idByTimestamp = dayjs(new Date()).valueOf()
  //   setMarkups((prevState) => {
  //     return {
  //       ...prevState,
  //       [positionsCar[tabsValue]]: [
  //         ...prevState[positionsCar[tabsValue]],
  //         {
  //           id: idByTimestamp,
  //           type: markupValue,
  //           positions: {
  //             web: {
  //               top: isMobile
  //                 ? positionTop + positionTop * 0.3
  //                 : positionTop - 22,
  //               left: isMobile
  //                 ? positionLeft + positionLeft * 0.3
  //                 : positionLeft - 22,
  //             },
  //             mobile: {
  //               top: isMobile
  //                 ? positionTop - 15
  //                 : positionTop - positionTop * 0.3 - 15,
  //               left: isMobile
  //                 ? positionLeft - 15
  //                 : positionLeft - positionLeft * 0.3 - 15,
  //             },
  //           },
  //         },
  //       ],
  //     }
  //   })
  //   const result = await screenShotToPng(tabsValue)
  //   if (result) {
  //     setScreenShots((prevState) => ({
  //       frente: tabsValue === 0 ? result : prevState.frente,
  //       lateralEsquerdo: tabsValue === 1 ? result : prevState.lateralEsquerdo,
  //       lateralDireito: tabsValue === 2 ? result : prevState.lateralDireito,
  //       traseira: tabsValue === 3 ? result : prevState.traseira,
  //       teto: tabsValue === 4 ? result : prevState.teto,
  //     }))
  //   }
  // }

  function handleObservation(event: ChangeEvent<HTMLInputElement>) {
    setObservations((prevState) => {
      return {
        ...prevState,
        [positionsCar[tabsValue]]: event.target.value,
      }
    })
  }

  useEffect(() => {
    if (isOpen) {
      const stageActual = data?.filter((itens) => itens.name === stageName)[0]
      console.log(stageName)
      const positonsCarData = stageActual?.itens.filter(
        (itens) => itens.rules.type === 'visual_inspect',
      )
      console.log(positonsCarData)
      const newPositionsUrl = {
        frente: '',
        lateralEsquerdo: '',
        lateralDireito: '',
        traseira: '',
        teto: '',
      }
      const newPositionsMarkups: MarkupListType = {
        frente: [],
        lateralEsquerdo: [],
        lateralDireito: [],
        traseira: [],
        teto: [],
      }
      const newPositionsImageList: imagemList = {
        frente: [],
        lateralEsquerdo: [],
        lateralDireito: [],
        traseira: [],
        teto: [],
      }
      const newPositionsObservations: ObservationsType = {
        frente: '',
        lateralEsquerdo: '',
        lateralDireito: '',
        traseira: '',
        teto: '',
      }
      const newScreenShots: ObservationsType = {
        frente: '',
        lateralEsquerdo: '',
        lateralDireito: '',
        traseira: '',
        teto: '',
      }

      if (positonsCarData) {
        positonsCarData[0]?.values?.labels?.forEach((item) => {
          switch (item.name) {
            case 'Frente':
              newPositionsUrl.frente = item.url_image ?? []
              // @ts-ignore
              newPositionsMarkups.frente = item.value ?? []
              newPositionsObservations.frente = item.comment ?? ''
              newPositionsImageList.frente = item.images ?? []
              newScreenShots.frente = item.screenShot ?? ''
              break
            case 'Lateral esquerda':
              newPositionsUrl.lateralEsquerdo = item.url_image
              // @ts-ignore
              newPositionsMarkups.lateralEsquerdo = item.value ?? []
              newPositionsObservations.lateralEsquerdo = item.comment ?? ''
              newPositionsImageList.lateralEsquerdo = item.images ?? []
              newScreenShots.lateralEsquerdo = item.screenShot ?? ''
              break
            case 'Lateral direita':
              newPositionsUrl.lateralDireito = item.url_image
              // @ts-ignore
              newPositionsMarkups.lateralDireito = item.value ?? []
              newPositionsObservations.lateralDireito = item.comment ?? ''
              newPositionsImageList.lateralDireito = item.images ?? []
              newScreenShots.lateralDireito = item.screenShot ?? ''
              break
            case 'Traseira':
              newPositionsUrl.traseira = item.url_image
              // @ts-ignore
              newPositionsMarkups.traseira = item.value ?? []
              newPositionsObservations.traseira = item.comment ?? ''
              newPositionsImageList.traseira = item.images ?? []
              newScreenShots.traseira = item.screenShot ?? ''
              break
            case 'Teto':
              newPositionsUrl.teto = item.url_image
              // @ts-ignore
              newPositionsMarkups.teto = item.value ?? []
              newPositionsObservations.teto = item.comment ?? ''
              newPositionsImageList.teto = item.images ?? []
              newScreenShots.teto = item.screenShot ?? ''
              break
            default:
              break
          }
        })
        setImgPositionCarUrl(newPositionsUrl)
        setMarkups(newPositionsMarkups)
        setListImagesUpload(newPositionsImageList)
        setObservations(newPositionsObservations)
      }
    }
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
      scroll={'paper'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          paddingX: 0,
          paddingTop: 0,
          height: 440,
          // overflowY: 'hidden',
        }}
        dividers
      >
        <AppBar position="static">
          <TabsContainer
            value={tabsValue}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs"
          >
            <Tab label="Frente" {...a11yProps(0)} />
            <Tab
              label="Lateral esquerdo"
              sx={{ whiteSpace: 'nowrap', px: 5 }}
              {...a11yProps(1)}
            />
            <Tab
              label="Lateral direita"
              sx={{ whiteSpace: 'nowrap', px: 4 }}
              {...a11yProps(2)}
            />
            <Tab label="Traseira" {...a11yProps(3)} />
            <Tab label="Teto" {...a11yProps(4)} />
          </TabsContainer>
        </AppBar>
        <Grid
          container
          sx={{ padding: 2 }}
          gap={{
            lg: 0,
            md: 1,
            xs: 1,
          }}
        >
          {/* <Grid
            item
            xs={12}
            md={2}
            lg={2}
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ContainerButtonsMarkupType
              gap={2}
              direction={{
                xs: 'row',
                md: 'column',
                lg: 'column',
              }}
            >
              {Object.keys(markupTagTypes).map((item) => (
                <LabelButtonMarkupType key={item}>
                  <ButtonMarkupType
                    selectedActual={markupValue === item}
                    onClick={() => {
                      handleChangeMarkupValue(item as markupTypesEnum)
                    }}
                    disabled={true}
                  >
                    {markupTagTypes[item]}
                  </ButtonMarkupType>
                  <span>{item}</span>
                </LabelButtonMarkupType>
              ))}
            </ContainerButtonsMarkupType>
          </Grid> */}
          <Grid item xs={12} md={9} lg={7}>
            <TabPanel
              value={tabsValue}
              index={0}
              dir={theme.direction}
              // ref={containerImageCarFrenteRef}
            >
              <div ref={containerImageCarFrenteRef}>
                <ClickableArea
                  src={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.frente}`}
                />
                {markups.frente.map((m) => {
                  return (
                    <ButtonMarkup
                      key={m.id}
                      mobile={{
                        top: m?.positions?.mobile?.top,
                        left: m?.positions?.mobile?.left,
                      }}
                      web={{
                        top: m?.positions?.web?.top,
                        left: m?.positions?.web?.left,
                      }}
                      disabled
                    >
                      <span>{markupTagTypes[m.type]}</span>
                      <DeleteForeverRoundedIcon
                        sx={{ zIndex: 10, position: 'fixed' }}
                      />
                    </ButtonMarkup>
                  )
                })}
              </div>
              {/* </ClickableSVG> */}
            </TabPanel>
            <TabPanel value={tabsValue} index={1} dir={theme.direction}>
              <div ref={containerImageCarLateralEsquerdaRef}>
                <ClickableArea
                  src={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.lateralEsquerdo}`}
                />
                {markups.lateralEsquerdo.map((m) => {
                  return (
                    <ButtonMarkup
                      key={m.id}
                      mobile={{
                        top: m?.positions?.mobile?.top,
                        left: m?.positions?.mobile?.left,
                      }}
                      web={{
                        top: m?.positions?.web?.top,
                        left: m?.positions?.web?.left,
                      }}
                      disabled
                    >
                      <span>{markupTagTypes[m.type]}</span>
                      <DeleteForeverRoundedIcon
                        sx={{ zIndex: 10, position: 'fixed' }}
                      />
                    </ButtonMarkup>
                  )
                })}
              </div>
            </TabPanel>
            <TabPanel value={tabsValue} index={2} dir={theme.direction}>
              <div ref={containerImageCarLateralDireitaRef}>
                <ClickableArea
                  src={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.lateralDireito}`}
                />
                {markups.lateralDireito.map((m) => {
                  return (
                    <ButtonMarkup
                      key={m.id}
                      mobile={{
                        top: m?.positions?.mobile?.top,
                        left: m?.positions?.mobile?.left,
                      }}
                      web={{
                        top: m?.positions?.web?.top,
                        left: m?.positions?.web?.left,
                      }}
                      disabled
                    >
                      <span>{markupTagTypes[m.type]}</span>
                      <DeleteForeverRoundedIcon
                        sx={{ zIndex: 10, position: 'fixed' }}
                      />
                    </ButtonMarkup>
                  )
                })}
              </div>
            </TabPanel>
            <TabPanel value={tabsValue} index={3} dir={theme.direction}>
              <div ref={containerImageCarTraseiraRef}>
                <ClickableArea
                  src={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.traseira}`}
                />
                {markups.traseira.map((m) => {
                  return (
                    <ButtonMarkup
                      key={m.id}
                      mobile={{
                        top: m?.positions?.mobile?.top,
                        left: m?.positions?.mobile?.left,
                      }}
                      web={{
                        top: m?.positions?.web?.top,
                        left: m?.positions?.web?.left,
                      }}
                      disabled
                    >
                      <span>{markupTagTypes[m.type]}</span>
                      <DeleteForeverRoundedIcon
                        sx={{ zIndex: 10, position: 'fixed' }}
                      />
                    </ButtonMarkup>
                  )
                })}
              </div>
            </TabPanel>
            <TabPanel value={tabsValue} index={4} dir={theme.direction}>
              <div ref={containerImageCarTetoRef}>
                <ClickableArea
                  src={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.teto}`}
                />
                {markups.teto.map((m) => {
                  return (
                    <ButtonMarkup
                      key={m.id}
                      mobile={{
                        top: m?.positions?.mobile?.top,
                        left: m?.positions?.mobile?.left,
                      }}
                      web={{
                        top: m?.positions?.web?.top,
                        left: m?.positions?.web?.left,
                      }}
                      disabled
                    >
                      <span>{markupTagTypes[m.type]}</span>
                      <DeleteForeverRoundedIcon
                        sx={{ zIndex: 10, position: 'fixed' }}
                      />
                    </ButtonMarkup>
                  )
                })}
              </div>
            </TabPanel>
          </Grid>
          <Grid item xs={12} md={12} lg={5}>
            <ContainerInformation direction="column">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                padding={0.7}
              >
                <Title>
                  {/* <IconUpload /> */}
                  imagem
                </Title>
                {/* <IconClose /> */}
              </Stack>
              <Divider />
              <Box sx={{ padding: 1 }}>
                <InspectionDropzone
                  listImagesUpload={listImagesUpload}
                  positionsCar={positionsCar[tabsValue]}
                />
              </Box>
              <Divider />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                padding={0.7}
              >
                <Title>observações</Title>
                {/* <IconClose /> */}
              </Stack>
              <Divider />
              <Box sx={{ padding: 1 }}>
                {/* @ts-ignore */}
                <TextAreaField
                  id="outlined-multiline-static"
                  multiline
                  rows={5}
                  fullWidth
                  size="small"
                  value={observations[positionsCar[tabsValue]]}
                  onChange={handleObservation}
                  disabled={true}
                />
              </Box>
            </ContainerInformation>
            <ContainerButtonsInformation direction="row" spacing={2}>
              <ButtonCancel variant="contained" onClick={handleClose}>
                sair
              </ButtonCancel>
            </ContainerButtonsInformation>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default ModalInspectCar
