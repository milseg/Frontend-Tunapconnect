import { useForm } from 'react-hook-form'

import { Stack } from '@mui/system'

import { ButtonModalActions, InputText, ErrorContainer } from './styles'
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

import { useRouter } from 'next/router'

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

interface GroupType {
  group: {
    created_at: string
    id_group: number
    name: string
    updated_at: string
  }
}

export default function EditCompanyById() {
  // const [data, setData] = useState<CompanyResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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
    },
  })

  const router = useRouter()

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  async function onSubmit(dataForm: any) {
    setIsLoading(true)
    try {
      const dataFormatted = {
        name: dataForm?.name,
      }
      console.log(dataFormatted)

      const result = await apiB.put(`/groups/${router.query.id}`, dataFormatted)

      handleActiveAlert(true, 'success', `${result.data.message}`)
      setIsLoading(false)
      await router.push(`/grupos`)
    } catch (error: any) {
      console.log(error)
      if (error.response.status === 400) {
        handleActiveAlert(true, 'error', error.response.data.message)
      } else {
        handleActiveAlert(true, 'error', error.response.data.message)
      }
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

  useEffect(() => {
    async function getData() {
      try {
        const result = await apiB.get<GroupType>(`/groups/${router.query.id}`)
        setValue('name', result.data.group.name)
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
        <Typography variant="h5">Edição de Grupo</Typography>
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
            Nome
            <InputText
              variant="outlined"
              style={{ marginTop: 2 }}
              fullWidth
              error={!!errors.name}
              {...register('name')}
            />
            <ErrorContainer>{errors.name?.message}</ErrorContainer>
          </label>
          <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
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
