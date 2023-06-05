import { AlertDialog } from '@/components/AlertDialog'
import { IconButton, Stack, Typography } from '@mui/material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import TableRow from '@mui/material/TableRow'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { useFieldArray, useForm } from 'react-hook-form'
import { Itens, StagesDataProps } from '../../../types'
import {
  ImageUploadBadge,
  ImageUploadImg,
  InputContainer,
  InputLabelRow,
  InputText,
} from '../styles'
import { genereteInput } from './GenereteInputs'
import ModalImages from './ModalImages'
import ModalInspectCar from './ModalInspectCar'
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
  image: string[]
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
  handleGetValuesForm: () => Promise<handleGetValuesFormReturnType>
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
    handleChangeTabContent,
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
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    newTab: null | number
  }>({
    isOpen: false,
    newTab: null,
  })

  const [isAlteredForm, setIsAlteredForm] = useState(false)

  const defaultValues = {
    [stageName]: stageData?.itens.map((item, index) => {
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

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { isDirty },
  } = useForm({
    defaultValues,
  })

  // eslint-disable-next-line no-unused-vars
  const { update } = useFieldArray({
    control,
    name: stageName,
  })

  useImperativeHandle(ref, () => ({
    handleOpenAlertDialog,
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
      const isImagesInList = stageActual.findIndex((img) => img.id === index)

      if (isImagesInList >= 0) {
        console.log('entrou 0')
        const valueFormatted = {
          ...prevState,
          [stageName]: prevState[stageName].map((i) => {
            console.log([...i.images, image])
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
    setIsAlteredForm(true)
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

    setIsAlteredForm(true)
  }

  function handleCloseModalSignature() {
    setOpenModalSignature({
      id: null,
      open: false,
    })
  }

  function handleSaveSignatures(signatures: CheckListSignatures[]) {
    setDataModals((prevState) => {
      return {
        ...prevState,
        signatures,
      }
    })
    setIsAlteredForm(true)
  }

  function handleInspectionData(data: InspectionCarData[]) {
    setDataModals((prevState) => {
      return {
        ...prevState,
        inspection: data,
      }
    })
    setIsAlteredForm(true)
  }

  // console.log(listImage[stageName])

  async function handleOpenAlertDialog(value: number) {
    if (!isDirty && !isAlteredForm) {
      handleChangeTabContent(value)
    } else {
      setAlertDialog({ isOpen: true, newTab: value })
    }
  }

  async function handleGetValuesForm() {
    const isAlreadyInspections = stageData?.itens.filter(
      (item) => item.rules.type === 'visual_inspect',
    )
    const data = getValues()

    let defaultLabel: any

    if (isAlreadyInspections) {
      defaultLabel = isAlreadyInspections[0].values
        .labels as InspectionCarData[]
    }

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
            images: listImage[stageName].filter((i) => i.id === index),
            value: data[stageName]?.[index]?.inputs,
          },
        }
      }),
    }
    return dataFormatted
  }

  function handleOpenAlertDialogIsSave(isSave: boolean, newTap: null | number) {
    // handleChangeTabContent(newTap)
    // if (isSave) {
    //   const valuesActual = getValues(stageName)
    //   setTypeSubmitForm('salvo')
    //   // @ts-ignore
    //   const valuesActualFormatted = { [stageName]: [...valuesActual] }
    //   onSubmitData(valuesActualFormatted)
    //   setIsAlteredForm(false)
    //   if (newTap !== null) handleChangeTabContent(newTap)
    // } else {
    //   setIsAlteredForm(false)
    //   if (newTap !== null) handleChangeTabContent(newTap)
    // }
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
            images: listImage[stageName].filter((i) => i.id === index),
            value: data[stageName]?.[index]?.inputs,
          },
        }
      }),
    }

    handleAddListCheckList(dataFormatted as StagesDataProps)
  }

  function handleCloseAlertDialog() {
    setAlertDialog({
      isOpen: false,
      newTab: null,
    })
  }

  // useEffect(() => {
  //   const sessionStorageData = sessionStorage.getItem(
  //     `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${router.query.id}`,
  //   )

  //   const data = sessionStorageData ? JSON.parse(sessionStorageData) : null
  //   if (data && Object.hasOwn(data, stageName)) {
  //     data[stageName]?.formState?.forEach((item: any, index: number) => {
  //       update(index, { inputs: item.inputs, observation: item.observation })
  //     })
  //     if (data[stageName]?.imagesList?.length > 0) {
  //       setListImage((prevState) => {
  //         const indexStageName = prevState.findIndex((item) =>
  //           Object.hasOwn(item, stageName),
  //         )
  //         const newListImage = [...prevState]
  //         if (indexStageName > -1) {
  //           newListImage[indexStageName][stageName] = data[stageName].imagesList
  //           return newListImage
  //         } else {
  //           return [
  //             ...newListImage,
  //             {
  //               [stageName]: data[stageName].imagesList,
  //             },
  //           ]
  //         }
  //       })
  //     }
  //   }
  // }, [stageName])

  // useEffect(() => {
  //   if (isDirty) {
  //     const sessionStorageData = sessionStorage.getItem(
  //       `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${router.query?.id}`,
  //     )
  //     const data = sessionStorageData ? JSON.parse(sessionStorageData) : null
  //     console.log(stageValuesWatch)

  //     if (data) {
  //       sessionStorage.setItem(
  //         `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${checklistModel?.id}`,
  //         JSON.stringify({
  //           ...data,
  //           [stageName]: {
  //             ...data[stageName],
  //             formState: stageValuesWatch,
  //           },
  //         }),
  //       )
  //     } else {
  //       sessionStorage.setItem(
  //         `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${checklistModel?.id}`,
  //         JSON.stringify({
  //           [stageName]: {
  //             formState: stageValuesWatch,
  //           },
  //         }),
  //       )
  //     }
  //   }
  // }, [stageValuesWatch])

  useEffect(() => {
    const stageListImages = stageItems.filter((i) => {
      if (i.values?.images) {
        return i.rules.type !== 'visual_inspect' && i.values?.images?.length > 0
      } else {
        return false
      }
    }) as ImageProps[] | []

    setListImage((prevState) => {
      if (Object.hasOwn(prevState, stageName)) {
        return {
          ...prevState,
          [stageName]: stageListImages,
        }
      }
      return {
        [stageName]: stageListImages,
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
        stageData={stageData}
        // @ts-ignore
        handleInspectionData={handleInspectionData}
      />
      <ModalSignatures
        isOpen={openModalSignature}
        closeModalSignatures={handleCloseModalSignature}
        stageName={stageName}
        signaturesData={dataModals?.signatures}
        stageData={stageData?.signatures}
        handleSaveSignatures={handleSaveSignatures}
      />
      <AlertDialog
        isOpen={alertDialog}
        handleClose={handleCloseAlertDialog}
        handleOpenAlertDialogIsSave={handleOpenAlertDialogIsSave}
      />
    </>
  )
})

export default TabContent

// export default TabContent
