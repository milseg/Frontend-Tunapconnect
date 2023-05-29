import { AlertDialog } from '@/components/AlertDialog'
import { IconButton, Stack, Typography } from '@mui/material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import TableRow from '@mui/material/TableRow'
import { forwardRef, useImperativeHandle, useState } from 'react'

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

interface RefType {
  handleOpenAlertDialog: (value: number) => void
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
  }))

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
    setIsAlteredForm(true)
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
    setIsAlteredForm(true)
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

  async function handleOpenAlertDialog(value: number) {
    console.log(isAlteredForm, isDirty)
    if (!isDirty && !isAlteredForm) {
      handleChangeTabContent(value)
    } else {
      setAlertDialog({ isOpen: true, newTab: value })
    }
  }

  function handleOpenAlertDialogIsSave(isSave: boolean, newTap: null | number) {
    if (isSave) {
      const valuesActual = getValues(stageName)
      setTypeSubmitForm('salvo')
      // @ts-ignore
      const valuesActualFormatted = { [stageName]: [...valuesActual] }
      onSubmitData(valuesActualFormatted)
      setIsAlteredForm(false)
      if (newTap !== null) handleChangeTabContent(newTap)
    } else {
      setIsAlteredForm(false)
      if (newTap !== null) handleChangeTabContent(newTap)
    }
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
            images: listImage[index]?.id ? listImage[index].images : [],
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
