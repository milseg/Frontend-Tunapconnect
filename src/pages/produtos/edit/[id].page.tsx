import { useForm } from 'react-hook-form'

import { Stack } from '@mui/system'

import { ButtonModalActions, InputText, ErrorContainer } from './styles'
import { useEffect, useState } from 'react'
import { apiB } from '@/lib/api'

import {
  Skeleton,
  Backdrop,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ActionAlerts from '@/components/ActionAlerts'

import { useRouter } from 'next/router'
import { ProductType } from '@/types/products'

// import { formatCNPJAndCPFNumber } from '@/ultis/formatCNPJAndCPF'

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

export interface GroupType {
  id_group: number
  name: string
  qtd_empresas: number
}

export default function EditCompanyById() {
  // const [data, setData] = useState<CompanyResponse | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isLoadingValues, setIsLoadingValues] = useState(false)
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
      guarantee_value: '',
      sale_value: '',
      tunap_code: '',
    },
  })

  const router = useRouter()

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  async function onSubmit(dataForm: any) {
    setIsLoadingData(true)
    try {
      const dataFormatted = {
        guarantee_value: dataForm?.guarantee_value,
        sale_value: dataForm?.sale_value,
        tunap_code: dataForm?.tunap_code,
      }
      console.log(dataFormatted)

      const result = await apiB.put(
        `/products/${router.query.id}`,
        dataFormatted,
      )

      handleActiveAlert(true, 'success', `${result.data.message}`)
      setIsLoadingData(false)
      await router.push(`/produtos/${router.query.id}`)
    } catch (error: any) {
      if (error.response.status === 400) {
        handleActiveAlert(true, 'error', error.response.data.message)
      } else {
        handleActiveAlert(true, 'error', error.response.data.message)
      }
      setIsLoadingData(false)
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

  useEffect(() => {
    async function getData() {
      try {
        setIsLoadingValues(true)
        const result = await apiB.get<ProductType>(
          `/products/${router.query.id}`,
        )
        setValue('guarantee_value', String(result.data.guarantee_value))
        setValue('sale_value', String(result.data.sale_value))
        setValue('tunap_code', result.data.tunap_code)
        setIsLoadingValues(false)
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
        <Typography variant="h5">Edição de Produto</Typography>
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
            Preço de Venda
            {!isLoadingValues ? (
              <InputText
                variant="outlined"
                style={{ marginTop: 2 }}
                fullWidth
                error={!!errors.sale_value}
                {...register('sale_value')}
              />
            ) : (
              <Skeleton variant="rounded" sx={{ width: '100%' }} height={60} />
            )}
            <ErrorContainer>{errors.sale_value?.message}</ErrorContainer>
          </label>
          <label>
            Preço de revenda
            {!isLoadingValues ? (
              <InputText
                variant="outlined"
                style={{ marginTop: 2 }}
                fullWidth
                error={!!errors.guarantee_value}
                {...register('guarantee_value')}
              />
            ) : (
              <Skeleton variant="rounded" sx={{ width: '100%' }} height={60} />
            )}
            <ErrorContainer>{errors.guarantee_value?.message}</ErrorContainer>
          </label>
          <label>
            Código TUNAP
            {!isLoadingValues ? (
              <InputText
                variant="outlined"
                error={!!errors.tunap_code}
                style={{ marginTop: 2 }}
                fullWidth
                {...register('tunap_code')}
              />
            ) : (
              <Skeleton variant="rounded" sx={{ width: '100%' }} height={60} />
            )}
            <ErrorContainer>{errors.guarantee_value?.message}</ErrorContainer>
          </label>
          <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
            <ButtonModalActions type="submit">Salvar</ButtonModalActions>
          </Stack>
        </Stack>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
          open={isLoadingData}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
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
