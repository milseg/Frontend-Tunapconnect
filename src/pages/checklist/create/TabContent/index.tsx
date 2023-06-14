import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
import { IconButton, Stack, Typography } from '@mui/material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import TableRow from '@mui/material/TableRow'

import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { useFieldArray, useForm } from 'react-hook-form'
import { Itens, StagesDataProps } from '../../types'

import {
  ImageUploadBadge,
  ImageUploadImg,
  InputContainer,
  InputLabelRow,
  InputText,
} from '../styles'
import { genereteInput } from './GenereteInputs'
import ModalImages from './ModalImages'
import ModalInspectCar, {
  getValuesInspectionReturnType,
} from './ModalInspectCar'
import ModalSignatures from './ModalSignatures'
import {
  ButtonsFinalized,
  ButtonSignatures,
  ButtonsSave,
  MarginBottomHack,
} from './styles'

type ImageProps = {
  id: number
  images: {
    id: number
    name: string
    url: string
    size: string
  }[]
}

type ImageListProps = {
  [key: string]: ImageProps[] | []
}

type OpenModalImage = {
  id: number | null
  open: boolean
}
type openModalSignatureType = {
  id: number | null
  open: boolean
}

type OnSubmitData = {
  [x: string]:
    | (
        | {
            inputs: string | boolean
            observation: string | undefined
          }
        | {
            observation: string | undefined
            inputs?: undefined
          }
      )[]
    | undefined
}

type CheckListSignatures = {
  name: string
  rules: {
    required: boolean
  }
  image: string
}

type InspectionCarData = {
  name: string
  url_image: string
  value: {
    id: number
    type: 'amassado' | 'riscado' | 'quebrado' | 'faltando' | 'none'
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
  }[]
  comment: string
  images: {
    id: number
    name: string
    url: string
    size: string
  }[]
}

type TabContentProps = {
  stageData: StagesDataProps | undefined
  // checklistModel: ReponseGetCheckList | undefined
  stageName: string
  stageItems: Itens[]
  formIDSubmit: string
  isClosed: boolean
  stageSaved?: boolean
  handleAddListCheckList: (data: StagesDataProps) => void
  handleChangeTabContent: (newValue: number) => void
}

export type handleGetValuesFormReturnType = {
  [x: string]:
    | (
        | {
            inputs: string | boolean
            observation: string | undefined
          }
        | {
            observation: string | undefined
            inputs?: undefined
          }
      )[]
    | undefined
}

interface RefType {
  handleOpenAlertDialog: (value: number) => void
  handleGetValuesForm: () => Promise<StagesDataProps>
}

interface modalInspectionCarRefType {
  getValuesInspection: () => getValuesInspectionReturnType
}

const TabContent = forwardRef<RefType, TabContentProps>(function TabContent(
  props,
  ref,
) {
  const {
    stageData,
    stageName,
    stageItems,
    formIDSubmit,
    handleAddListCheckList,
    isClosed,
  } = props
  const [openModalInspectCar, setOpenModalInspectCar] = useState(false)
  const [openModalImage, setOpenModalImage] = useState<OpenModalImage>({
    id: null,
    open: false,
  })
  const [openModalSignature, setOpenModalSignature] =
    useState<openModalSignatureType>({
      id: null,
      open: false,
    })
  const [listImage, setListImage] = useState<ImageListProps>({})
  const [typeSubmitForm, setTypeSubmitForm] = useState<
    'salvo' | 'finalizado' | 'rascunho'
  >('rascunho')

  const [dataModals, setDataModals] = useState<{
    signatures: CheckListSignatures[]
    inspection: InspectionCarData[]
  }>({
    signatures: [],
    inspection: [],
  })

  // const router = useRouter()

  const { serviceScheduleState } = useContext(ServiceScheduleContext)
  const { checklistModel } = serviceScheduleState

  const stageActual = checklistModel?.stages.filter(
    (stage) => stage.name === stageName,
  )[0] as StagesDataProps

  const modalCarRef = useRef<modalInspectionCarRefType>(null)

  const defaultValues = {
    [stageName]: stageActual?.itens.map((item, index) => {
      if (item.rules.type === 'select') {
        return {
          inputs: item.values.value ?? '-',
          observation: item.comment,
        }
      }
      if (item.rules.type === 'visual_inspect') {
        return {
          observation: item.comment,
        }
      }
      return { inputs: item.values.value, observation: item.comment }
    }),
  }

  const { control, register, handleSubmit, getValues } = useForm({
    defaultValues,
  })

  // eslint-disable-next-line no-unused-vars
  const { update, fields } = useFieldArray({
    control,
    name: stageName,
  })

  useImperativeHandle(ref, () => ({
    // handleOpenAlertDialog,
    // @ts-ignore
    handleGetValuesForm, // arrumar
  }))

  function handleOpenModalInspectCar(value: boolean) {
    setOpenModalInspectCar(value)
  }
  function closeModalInspectCar() {
    setOpenModalInspectCar(false)
  }

  // function getIndexStageNameInListImage() {
  //   return listImage.findIndex((item) => Object.hasOwn(item, stageName))
  // }

  function closeModalImage() {
    setOpenModalImage({ id: null, open: false })
  }

  function getBagdeAmountImages(index: number) {
    if (Object.hasOwn(listImage, stageName)) {
      const imgs = listImage[stageName].filter((image) => image.id === index)[0]
      return imgs?.images.length ?? 0
    }
    return 0
  }

  function handleAddImageInListImage(
    index: number,
    image: {
      id: number
      name: string
      url: string
      size: string
    },
  ) {
    console.log(image)
    setListImage((prevState) => {
      const stageActual = prevState[stageName]
      if (!Object.hasOwn(prevState, stageName)) {
        return {
          ...prevState,
          [stageName]: [
            {
              id: index,
              images: [image],
            },
          ],
        }
      }
      const isImagesInList = stageActual.findIndex((img) => img.id === index)

      if (isImagesInList >= 0) {
        const valueFormatted = {
          ...prevState,
          [stageName]: prevState[stageName].map((i) => {
            if (index === i.id) {
              return {
                id: index,
                images: [...i.images, image],
              }
            }
            return i
          }),
        }
        console.log(valueFormatted)
        return valueFormatted
      }

      if (isImagesInList < 0) {
        if (prevState[stageName].length !== 0) {
          return {
            ...prevState,
            [stageName]: [
              ...prevState[stageName],
              {
                id: index,
                images: [{ ...image }],
              },
            ],
          }
        }
      }
      return {
        ...prevState,
        [stageName]: [
          {
            id: index,
            images: [{ ...image }],
          },
        ],
      }
    })
  }

  function handleRemoveImageInListImage(index: number, imageId: number) {
    const findIndexListImage = listImage[stageName].findIndex(
      (item) => item.id === index,
    )

    setListImage((prevState) => {
      const stageActual = prevState[stageName]
      prevState[stageName][findIndexListImage].images = prevState[stageName][
        findIndexListImage
      ].images.filter((item) => item.id !== imageId)
      console.log(stageActual)

      return {
        ...prevState,
        [stageName]: stageActual,
      }
    })
  }

  function handleCloseModalSignature() {
    setOpenModalSignature({
      id: null,
      open: false,
    })
  }

  function handleSaveSignatures(signatures: CheckListSignatures[]) {
    console.log(signatures)
    setDataModals((prevState) => {
      return {
        ...prevState,
        signatures,
      }
    })
  }

  function handleInspectionData(data: InspectionCarData[]) {
    setDataModals((prevState) => {
      return {
        ...prevState,
        inspection: data,
      }
    })
    console.log(data)
  }

  async function getValueInspectionCar() {
    if (modalCarRef.current && modalCarRef.current.getValuesInspection) {
      const result = await modalCarRef.current.getValuesInspection()
      console.log(result)
      return result
    }
  }

  async function handleGetValuesForm() {
    const inspectionCarValues = await getValueInspectionCar()
    console.log(dataModals?.signatures)
    const data = getValues()

    const dataFormatted = {
      ...stageData,
      status: 'Rascunho',
      signatures:
        dataModals?.signatures.length > 0
          ? dataModals?.signatures
          : stageData?.signatures,
      itens: stageItems.map((item, index) => {
        if (item.rules.type === 'visual_inspect') {
          return {
            ...item,
            comment: data[stageName]?.[index]?.observation,
            values: {
              labels: inspectionCarValues,
            },
          }
        }

        return {
          ...item,
          comment: data[stageName]?.[index]?.observation,
          values: {
            ...item.values,
            images: listImage[stageName]
              ? listImage[stageName].filter((i) => i.id === index)
              : [],
            value: data[stageName]?.[index]?.inputs,
          },
        }
      }),
    }
    return dataFormatted
  }

  function onSubmitData(data: OnSubmitData) {
    const isAlreadyInspections = stageData?.itens.filter(
      (item) => item.rules.type === 'visual_inspect',
    )

    let defaultLabel: any

    if (isAlreadyInspections) {
      defaultLabel = isAlreadyInspections[0].values
        .labels as InspectionCarData[]
    }

    const dataFormatted = {
      ...stageData,
      status: typeSubmitForm,
      signatures:
        dataModals?.signatures.length > 0
          ? dataModals?.signatures
          : stageData?.signatures,
      itens: stageItems.map((item, index) => {
        if (item.rules.type === 'visual_inspect') {
          return {
            ...item,
            comment: data[stageName]?.[index]?.observation,
            values: {
              labels:
                dataModals?.inspection.length > 0
                  ? dataModals?.inspection
                  : defaultLabel,
            },
          }
        }

        return {
          ...item,
          comment: data[stageName]?.[index]?.observation,
          values: {
            ...item.values,
            images: listImage[stageName]
              ? listImage[stageName].filter((i) => i.id === index)
              : [],
            value: data[stageName]?.[index]?.inputs,
          },
        }
      }),
    }

    handleAddListCheckList(dataFormatted as StagesDataProps)
  }

  useEffect(() => {
    const listImagesStage: ImageProps[] = []
    stageActual?.itens.forEach((item, index) => {
      const img = item.values.images === undefined ? [] : item.values.images
      // @ts-ignore
      listImagesStage.push(...img)
    })

    // console.log(inspection.values)

    // const dataMoldalFormatted = {
    //   signatures:{ stageActual.signatures},
    //   inspection: inspection.values.labels,
    // }

    // setDataModals(prevState => {
    //   const newSignitures = prevState.signatures.map(item => )
    //   return  {
    //     signatures: prevState.signatures]
    //   }
    // })

    setListImage((prevState) => {
      if (Object.hasOwn(prevState, stageName)) {
        return {
          ...prevState,
          [stageName]: listImagesStage,
        }
      }
      return {
        [stageName]: listImagesStage,
      }
    })
  }, [])

  return (
    <>
      <TableContainer
        id={formIDSubmit}
        component="form"
        onSubmit={handleSubmit(onSubmitData)}
      >
        <Table sx={{ minWidth: 750 }} aria-label="simple table">
          <TableBody>
            {stageItems.length > 0 &&
              stageItems.map((item, index) => {
                return (
                  <TableRow
                    key={`${Math.random() * 20000}-${item.name}-${index}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      {genereteInput(
                        item.rules.type,
                        item.values,
                        register,
                        stageName,
                        index,
                        isClosed,
                        control,
                        handleOpenModalInspectCar,
                      )}
                    </TableCell>
                    <TableCell>
                      {<Typography>{item.name}</Typography>}
                    </TableCell>
                    <TableCell>
                      {item?.rules?.type !== 'visual_inspect' && (
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="label"
                          size="small"
                          disabled={isClosed}
                          onClick={() => {
                            console.log(index)
                            setOpenModalImage({
                              id: index,
                              open: true,
                            })
                          }}
                        >
                          <ImageUploadBadge
                            badgeContent={getBagdeAmountImages(index) ?? ''}
                            color="warning"
                          >
                            <ImageUploadImg />
                          </ImageUploadBadge>
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      <InputContainer>
                        <InputLabelRow>Observação:</InputLabelRow>
                        <InputText
                          placeholder="Anotações..."
                          size="small"
                          fullWidth
                          disabled={isClosed}
                          {...register(`${stageName}.${index}.observation`)}
                        />
                      </InputContainer>
                    </TableCell>
                  </TableRow>
                )
              })}
            <TableRow>
              <TableCell colSpan={5}>
                <Stack direction="row" gap={2}>
                  {stageData?.signatures &&
                    stageData?.signatures.map((item, index) => (
                      <ButtonSignatures
                        key={item.name + index}
                        color="primary"
                        size="small"
                        variant="contained"
                        disabled={isClosed}
                        onClick={() =>
                          setOpenModalSignature({ id: index, open: true })
                        }
                      >
                        {item.name}
                      </ButtonSignatures>
                    ))}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <ButtonsSave
          type="submit"
          variant="contained"
          // form={`form-${data?.stages[painelValue].name ?? ''}-${painelValue}`}
          onClick={() => setTypeSubmitForm('salvo')}
        >
          Salvar
        </ButtonsSave>
        <ButtonsFinalized
          type="submit"
          variant="contained"
          // form={`form-${data?.stages[painelValue].name ?? ''}-${painelValue}`}
          onClick={() => {
            setTypeSubmitForm('finalizado')
          }}
        >
          Finalizar
        </ButtonsFinalized>
        <MarginBottomHack />
      </TableContainer>
      <ModalImages
        isOpen={openModalImage}
        closeModalImage={closeModalImage}
        handleAddImageInListImage={handleAddImageInListImage}
        handleRemoveImageInListImage={handleRemoveImageInListImage}
        listImage={listImage}
        stageName={stageName}
        idModal={openModalImage.id}
      />
      <ModalInspectCar
        isOpen={openModalInspectCar}
        closeModalInspectCar={closeModalInspectCar}
        stageData={stageActual}
        // @ts-ignore
        handleInspectionData={handleInspectionData}
        ref={modalCarRef}
      />
      <ModalSignatures
        isOpen={openModalSignature}
        closeModalSignatures={handleCloseModalSignature}
        stageName={stageName}
        signaturesData={dataModals?.signatures}
        stageData={stageActual?.signatures}
        handleSaveSignatures={handleSaveSignatures}
      />
    </>
  )
})

export default TabContent

// export default TabContent
