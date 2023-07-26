import { useForm } from 'react-hook-form'

import * as z from 'zod'

import { Stack } from '@mui/system'

import {
  ButtonModalActions,
  InputText,
  ErrorContainer,
  ButtonIcon,
} from './styles'
import { useEffect, useState } from 'react'
import { apiB } from '@/lib/api'

import {
  Backdrop,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ActionAlerts from '@/components/ActionAlerts'

import SearchIcon from '@mui/icons-material/Search'
import {
  conformedCNPJNumber,
  // TextMaskCPF,
  // TextMaskPHONE,
  TextMaskCNPJ,
} from '@/components/InputMask'
import { useRouter } from 'next/router'
import ModalSearchGroup from './components/ModalSearchGroup'

// import { formatCNPJAndCPFNumber } from '@/ultis/formatCNPJAndCPF'

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

interface CompanyResponse {
  address_1: string
  city: string
  cnpj: string
  created_at: string
  group_name: any
  id: number
  id_group: any
  id_responsible: number
  integration_code: string
  name: string
  province: string
  responsible_name: string
  updated_at: string
}

export interface GroupType {
  id_group: number
  name: string
  qtd_empresas: number
}

const newClientFormSchema = z.object({
  // name: z
  //   .string()
  //   .nonempty({ message: 'Digite um nome!' })
  //   .min(3, { message: 'Digite um nome valido!' }),
  // integration_code: z
  //   .string()
  //   .nonempty({ message: 'Digite um nome!' })
  //   .min(3, { message: 'Digite um nome valido!' }),
  // document: z.string().refine(
  //   (e) => {
  //     if (validateCNPJ(e)) {
  //       return true
  //     }
  //     return false
  //   },
  //   { message: 'Digite um valor valido!' },
  // ),
})

newClientFormSchema.required({
  name: true,
  document: true,
})

export default function EditCompanyById() {
  const [data, setData] = useState<CompanyResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [groupSelected, setGroupSelected] = useState<GroupType | null>(null)
  const [actionAlerts, setActionAlerts] = useState<actionAlertsProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })

  const {
    register,
    handleSubmit,
    setValue,
    // reset,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(newClientFormSchema),
    defaultValues: {
      name: '',
      document: '',
      integration_code: '',
    },
  })

  const router = useRouter()

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  async function onSubmit(dataForm: any) {
    setIsLoading(true)
    console.log(dataForm)
    const documentFormatted = dataForm.document.replace(/\D/g, '')
    try {
      const dataFormatted = {
        // company_id: companySelected,
        active: true,
        name: dataForm.name,
        cnpj: documentFormatted,
        id_group: groupSelected ? groupSelected.id_group : dataForm.id_group,
        integration_code: data?.integration_code,
      }
      console.log(dataFormatted)

      const result = await apiB.put(
        `/companies/${router.query.id}`,
        dataFormatted,
        // dataFormatted,
      )

      console.log(result)

      // {
      //   "cnpj": "68.119.835/0001-07",
      //   "id_group": null,
      //   "integration_code": "teste_integration",
      //   "name": "teste"
      // }

      handleActiveAlert(true, 'success', `${result.data.message}`)
    } catch (error: any) {
      if (error.response.status === 400) {
        handleActiveAlert(true, 'error', error.response.data.message)
      } else {
        handleActiveAlert(true, 'error', error.response.data.message)
      }
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  function handleCloseAlert(isOpen: boolean) {
    setActionAlerts((prevState) => ({
      ...prevState,
      isOpen,
    }))
  }
  function handleActiveAlert(
    isOpen: boolean,
    type: 'success' | 'error' | 'warning',
    title: string,
  ) {
    setActionAlerts({
      isOpen,
      title,
      type,
    })
  }

  function handleCloseModalGroup() {
    setOpenModal(false)
  }

  function handleAddGroup(value: GroupType) {
    setGroupSelected(value)
  }

  useEffect(() => {
    async function getData() {
      try {
        const result = await apiB.get(`/companies/${router.query.id}`)
        console.log(result.data)
        // name: '',
        // document: '',
        // integration_code: '',
        setData(result.data.company)

        setValue('name', result.data.company.name)
        // setValue('document', result.data.cnpj)
        setValue('document', conformedCNPJNumber(result.data.company.cnpj))
        setValue('integration_code', result.data.company.integration_code)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [router.query.id])

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">Cadastro de Empresa</Typography>
        <Stack
          gap={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: 550,
            minWidth: fullScreen ? 300 : 550,
            margin: '20px auto',
          }}
        >
          <label>
            Grupo
            <Stack direction="row" gap={2}>
              <InputText
                // variant="outlined"
                error={!!errors.document}
                // style={{ marginTop: 11 }}
                fullWidth
                value={
                  groupSelected
                    ? groupSelected?.name
                    : data?.group_name
                    ? data.group_name
                    : 'Não informado'
                }
                // value={data?.group_name ? data.group_name : 'Não informado'}
                disabled
              />
              <ButtonIcon
                sx={{
                  width: 56,
                  height: 56,
                }}
                onClick={() => setOpenModal(true)}
              >
                <SearchIcon />
              </ButtonIcon>
            </Stack>
          </label>

          <label>
            Nome
            <InputText
              variant="outlined"
              style={{ marginTop: 2 }}
              fullWidth
              error={!!errors.name}
              {...register('name')}
            />
            <ErrorContainer>{errors.integration_code?.message}</ErrorContainer>
          </label>
          <label>
            Código de integração
            <InputText
              // variant="outlined"
              // style={{ marginTop: 2 }}
              fullWidth
              error={!!errors.name}
              {...register('integration_code')}
              disabled
            />
            <ErrorContainer>{errors.integration_code?.message}</ErrorContainer>
          </label>
          <label>
            CNPJ
            <InputText
              // variant="outlined"
              error={!!errors.document}
              // style={{ marginTop: 2 }}
              fullWidth
              {...register('document')}
              InputProps={{
                // @ts-ignore
                inputComponent: TextMaskCNPJ,
              }}
              disabled
            />
          </label>
          <label>
            Endereço
            <InputText
              // variant="outlined"
              error={!!errors.document}
              // style={{ marginTop: 11 }}
              fullWidth
              value={data?.address_1 ? data.address_1 : 'Não informado'}
              disabled
            />
          </label>
          <label>
            Cidade
            <InputText
              // variant="outlined"
              error={!!errors.document}
              // style={{ marginTop: 11 }}
              fullWidth
              value={data?.city ? data.city : 'Não informado'}
              disabled
            />
          </label>
          <label>
            Responsável
            <InputText
              // variant="outlined"
              error={!!errors.document}
              // style={{ marginTop: 11 }}
              fullWidth
              value={
                data?.responsible_name ? data.responsible_name : 'Não informado'
              }
              disabled
            />
          </label>

          {/* {!isCPF && (
              <InputText
                label="CNPJ"
                variant="filled"
                // style={{ marginTop: 11 }}
                error={!!errors.cnpj}
                fullWidth
                {...register('cnpj', { required: true })}
                InputProps={{
                  // @ts-ignore
                  inputComponent: TextMaskCNPJ,
                }}
              />
            )} */}
          {/* {isCPF && (
              <ErrorContainer>{errors.document?.message}</ErrorContainer>
            )}
            {!isCPF && <ErrorContainer>{errors.cnpj?.message}</ErrorContainer>} */}

          <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
            {/* <ButtonModalActions onClick={handleClose}>
              Cancelar
            </ButtonModalActions> */}
            <ButtonModalActions type="submit">Salvar</ButtonModalActions>
          </Stack>
        </Stack>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
      <ModalSearchGroup
        openMolal={openModal}
        handleClose={handleCloseModalGroup}
        handleAddGroup={handleAddGroup}
        dataGroup={groupSelected}
      />
      <ActionAlerts
        isOpen={actionAlerts.isOpen}
        title={actionAlerts.title}
        type={actionAlerts.type}
        handleAlert={handleCloseAlert}
      />
    </>
  )
}
EditCompanyById.auth = true
