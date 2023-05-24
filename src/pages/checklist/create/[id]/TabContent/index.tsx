import { IconButton, Stack, Typography } from '@mui/material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import TableRow from '@mui/material/TableRow'
import { useState } from 'react'

import { useFieldArray, useForm } from 'react-hook-form'
import { Itens, ReponseGetCheckList, StagesDataProps } from '../../../types'
import {
  // ButtonItemChecklist,
  ImageUploadBadge,
  ImageUploadImg,
  InputContainer,
  InputLabelRow,
  InputText,
} from '../styles'
import { genereteInput } from './GenereteInputs'
import ModalImages from './ModalImages'
import ModalInspectCar from './ModalInspectCar'
import ModalSigntures from './ModalSigntures'
import {
  ButtonsFinalized,
  ButtonSignatures,
  ButtonsSave,
  MarginBottomHack,
} from './styles'

type ImageListProps = Array<{
  [key: string]: {
    id: number
    images: {
      id: number
      name: string
      url: string
      size: string
    }[]
  }[]
}>

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
            inputs: string
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
  checklistModel: ReponseGetCheckList | undefined
  stageName: string
  stageItems: Itens[]
  formIDSubmit: string
  isClosed: boolean
  stageSaved?: boolean
  handleAddListCheckList: (data: StagesDataProps) => void
}
// type InspectionData = {
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
//     }[]
//   }

//   comment: string
//   images: {
//     id: number
//     name: string
//     url: string
//     size: string
//   }[]
// }[]

function TabContent({
  stageData,
  stageName,
  stageItems,
  formIDSubmit,
  handleAddListCheckList,
  isClosed,
  checklistModel,
}: // handleSaveSignatures,
TabContentProps) {
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
  const [listImage, setListImage] = useState<ImageListProps>([])
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

  const { control, register, handleSubmit } = useForm({
    defaultValues,
  })

  // eslint-disable-next-line no-unused-vars
  const { update } = useFieldArray({
    control,
    name: stageName,
  })

  function handleOpenModalInspectCar(value: boolean) {
    setOpenModalInspectCar(value)
  }
  function closeModalInspectCar() {
    setOpenModalInspectCar(false)
  }

  function getIndexStageNameInListImage() {
    return listImage.findIndex((item) => Object.hasOwn(item, stageName))
  }

  function closeModalImage() {
    setOpenModalImage({ id: null, open: false })
  }

  function getBagdeAmountImages(index: number) {
    const IndexStageNameInListImage = getIndexStageNameInListImage()
    const imgs = listImage[IndexStageNameInListImage]?.[stageName].filter(
      (image) => image.id === index,
    )[0]
    return imgs?.images.length ?? 0
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
    setListImage((prevState) => {
      const newListImage = [...prevState]
      const indexStageName = newListImage.findIndex((item) =>
        Object.hasOwn(item, stageName),
      )

      if (indexStageName < 0) {
        return [
          {
            [stageName]: [
              {
                id: index,
                images: [{ ...image }],
              },
            ],
          },
        ]
      }

      const indexImage = prevState[indexStageName][stageName].findIndex(
        (item) => item.id === index,
      )
      console.log(indexImage)
      if (indexImage >= 0) {
        newListImage[indexStageName][stageName][indexStageName].images.push(
          image,
        )
        return newListImage
      } else {
        newListImage[indexStageName][stageName].push({
          id: index,
          images: [{ ...image }],
        })
        return newListImage
      }
    })
  }

  function handleRemoveImageInListImage(index: number, imageId: number) {
    const indexStageName = listImage.findIndex((item) =>
      Object.hasOwn(item, stageName),
    )
    const findIndexListImage = listImage[indexStageName][stageName].findIndex(
      (item) => item.id === index,
    )
    setListImage((prevState) => {
      const newListImage = [...prevState]
      newListImage[indexStageName][stageName][findIndexListImage].images =
        newListImage[indexStageName][stageName][
          findIndexListImage
        ].images.filter((image) => image.id !== imageId)

      return newListImage
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
    // setInspectionData(data)
  }

  function onSubmitData(data: OnSubmitData) {
    console.log(data)
    const isAlreadyInspections = stageData?.itens.filter(
      (item) => item.rules.type === 'visual_inspect',
    )

    let defaultLabel: any

    if (isAlreadyInspections) {
      defaultLabel = isAlreadyInspections[0].values
        .labels as InspectionCarData[]
    }

    console.log(dataModals)

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
            images: listImage[index]?.id ? listImage[index].images : [],
            value: data[stageName]?.[index]?.inputs,
          },
        }
      }),
    }
    console.log('data formatted', dataFormatted)
    // console.log('data formatted', stageData)
    handleAddListCheckList(dataFormatted as StagesDataProps)
  }

  // useEffect(() => {
  //   const sessionStorageData = sessionStorage.getItem(
  //     `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${checklistModel?.id}`,
  //   )

  //   const data = sessionStorageData ? JSON.parse(sessionStorageData) : null
  //   if (data && Object.hasOwn(data, stageName)) {
  //     console.log('entrou', data)
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
  //       `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${checklistModel?.id}`,
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
  // }, [touchedFields])

  // useEffect(() => {
  //   console.log(getValues(stageName))
  // }, [])
  // useEffect(() => {
  //   const indexStageName = listImage.findIndex((item) =>
  //     Object.hasOwn(item, stageName),
  //   )
  //   const sessionStorageData = sessionStorage.getItem(
  //     `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${checklistModel?.id}`,
  //   )

  //   const data = sessionStorageData ? JSON.parse(sessionStorageData) : null

  //   if (indexStageName > -1) {
  //     if (data) {
  //       sessionStorage.setItem(
  //         `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${checklistModel?.id}`,
  //         JSON.stringify({
  //           ...data,
  //           [stageName]: {
  //             ...data[stageName],
  //             imagesList: listImage[indexStageName][stageName],
  //           },
  //         }),
  //       )
  //     } else {
  //       sessionStorage.setItem(
  //         `${process.env.NEXT_PUBLIC_APP_SESSION_STORAGE_NAME}-${checklistModel?.id}`,
  //         JSON.stringify({
  //           [stageName]: {
  //             imagesList: listImage[indexStageName][stageName],
  //           },
  //         }),
  //       )
  //     }
  //   }
  // }, [listImage])

  // useEffect(() => {
  //   const isAlreadyInspections = stageData?.itens.filter(
  //     (item) => item.rules.type === 'visual_inspect',
  //   )

  //   if (isAlreadyInspections && inspectionData === undefined) {
  //     console.log(isAlreadyInspections)
  //     setInspectionData(
  //       // @ts-ignore
  //       isAlreadyInspections[0].values.labels as InspectionData,
  //     )
  //   }
  // }, [])

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
      />
      <ModalInspectCar
        isOpen={openModalInspectCar}
        closeModalInspectCar={closeModalInspectCar}
        stageData={stageData}
        // @ts-ignore
        handleInspectionData={handleInspectionData}
      />
      <ModalSigntures
        isOpen={openModalSignature}
        closeModalSignatures={handleCloseModalSignature}
        stageName={stageName}
        signaturesData={dataModals?.signatures}
        stageData={stageData?.signatures}
        handleSaveSignatures={handleSaveSignatures}
      />
    </>
  )
}

export default TabContent
