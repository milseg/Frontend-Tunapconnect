import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Stack } from '@mui/system'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { ButtonAddInputs, ButtonModalActions, InputText } from '../../styles'
import { useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { CompanyContext } from '@/contexts/CompanyContext'
import { Backdrop, CircularProgress } from '@mui/material'
import ActionAlerts from '@/components/ActionAlerts'
import { ClientResponseType } from '@/types/service-schedule'
import { ErrorContainer } from './styles'
import { validateCPF } from '@/ultis/validation'

interface ModalCreateNewClientProps {
  handleClose: () => void
  handleSaveReturnClient: (client: ClientResponseType | null) => void
  isOpen: boolean
}

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

const newClientFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Digite um nome!' })
    .min(5, { message: 'Digite um nome valido!' }),
  document: z.string().refine(validateCPF, { message: 'CPF inválido!' }),
  phone: z.array(
    z.object({
      phone: z.string(),
    }),
  ),
  email: z.array(
    z.object({
      email: z
        .string()
        .email({ message: 'Digite um e-mail valido!' })
        .or(z.literal('')),
    }),
  ),
  address: z.array(
    z.object({
      address: z.string(),
    }),
  ),
})

newClientFormSchema.required({
  name: true,
  document: true,
})

type newClientFormData = z.infer<typeof newClientFormSchema>

export default function ModalCreateNewClient({
  isOpen,
  handleClose,
  handleSaveReturnClient,
}: ModalCreateNewClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionAlerts, setActionAlerts] = useState<actionAlertsProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })

  const { companySelected } = useContext(CompanyContext)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<newClientFormData>({
    resolver: zodResolver(newClientFormSchema),
    defaultValues: {
      name: '',
      document: '',
      phone: [{ phone: '' }],
      email: [{ email: '' }],
      address: [{ address: '' }],
    },
  })
  const {
    fields: fieldsPhone,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: 'phone',
  })

  const {
    fields: fieldsEmail,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: 'email',
  })
  const {
    fields: fieldsAddress,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: 'address',
  })

  async function onSubmit(data: any) {
    setIsLoading(true)
    const listPhone = data.phone
      .map((item: any) => item.phone)
      .filter((item: any) => item !== '')

    const listEmail = data.email
      .map((item: any) => item.email)
      .filter((item: any) => item !== '')

    const listAddress = data.address
      .map((item: any) => item.address)
      .filter((item: any) => item !== '')

    try {
      const dataFormatted = {
        company_id: companySelected,
        active: true,
        name: data.name,
        document: data.document,
        phone: listPhone,
        email: listEmail,
        address: listAddress,
      }

      const resp = await api.post('/client', dataFormatted)

      handleSaveReturnClient(resp.data.data[0])
      handleActiveAlert(true, 'success', resp.data.msg)
    } catch (error: any) {
      if (error.response.status === 400) {
        handleActiveAlert(true, 'error', error.response.data.msg)
      } else {
        handleActiveAlert(true, 'error', 'Erro inesperado!')
      }
      console.log(error)
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

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        document: '',
        phone: [{ phone: '' }],
        email: [{ email: '' }],
        address: [{ address: '' }],
      })
    }
  }, [isOpen])

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Criação de cliente </DialogTitle>
        <DialogContent>
          <Stack
            width={400}
            gap={1}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputText
              label="Nome"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('name', { required: true })}
            />
            <ErrorContainer>{errors.name?.message}</ErrorContainer>
            <InputText
              label="CPF"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('document', { required: true })}
            />
            <ErrorContainer>{errors.document?.message}</ErrorContainer>
            {fieldsPhone.map((item, index) => {
              return (
                <Stack direction="row" key={item.id}>
                  <Controller
                    render={({ field }) => (
                      <InputText
                        label="TELEFONE"
                        variant="filled"
                        style={{ marginTop: 11 }}
                        fullWidth
                        {...field}
                      />
                    )}
                    name={`phone.${index}.phone`}
                    control={control}
                  />
                  {index === 0 ? (
                    <ButtonAddInputs
                      onClick={() => {
                        appendPhone({ phone: '' })
                      }}
                      style={{ marginTop: 12, marginLeft: 10 }}
                    >
                      <AddCircleIcon />
                    </ButtonAddInputs>
                  ) : (
                    <ButtonAddInputs
                      onClick={() => removePhone(index)}
                      style={{ marginTop: 12, marginLeft: 10 }}
                    >
                      <DeleteIcon />
                    </ButtonAddInputs>
                  )}
                </Stack>
              )
            })}
            {fieldsEmail.map((item, index) => {
              return (
                <div key={item.id}>
                  <Stack direction="row" key={item.id}>
                    <Controller
                      render={({ field }) => (
                        <InputText
                          label="E-MAIL"
                          variant="filled"
                          style={{ marginTop: 11 }}
                          fullWidth
                          {...field}
                        />
                      )}
                      name={`email.${index}.email`}
                      control={control}
                    />
                    {index === 0 ? (
                      <ButtonAddInputs
                        onClick={() => {
                          appendEmail({ email: '' })
                        }}
                        style={{ marginTop: 12, marginLeft: 10 }}
                      >
                        <AddCircleIcon />
                      </ButtonAddInputs>
                    ) : (
                      <ButtonAddInputs
                        onClick={() => removeEmail(index)}
                        style={{ marginTop: 12, marginLeft: 10 }}
                      >
                        <DeleteIcon />
                      </ButtonAddInputs>
                    )}
                  </Stack>
                  <ErrorContainer sx={{ mt: 1 }}>
                    {errors?.email && errors?.email[index]?.email?.message}
                  </ErrorContainer>
                </div>
              )
            })}
            {fieldsAddress.map((item, index) => {
              return (
                <Stack direction="row" key={item.id}>
                  <Controller
                    render={({ field }) => (
                      <InputText
                        label="Endereço"
                        variant="filled"
                        style={{ marginTop: 11 }}
                        fullWidth
                        {...field}
                      />
                    )}
                    name={`address.${index}.address`}
                    control={control}
                  />
                  {index === 0 ? (
                    <ButtonAddInputs
                      onClick={() => {
                        appendAddress({ address: '' })
                      }}
                      style={{ marginTop: 12, marginLeft: 10 }}
                    >
                      <AddCircleIcon />
                    </ButtonAddInputs>
                  ) : (
                    <ButtonAddInputs
                      onClick={() => removeAddress(index)}
                      style={{ marginTop: 12, marginLeft: 10 }}
                    >
                      <DeleteIcon />
                    </ButtonAddInputs>
                  )}
                </Stack>
              )
            })}
            <Stack
              flexDirection="row"
              justifyContent="flex-end"
              gap={2}
              sx={{ marginTop: 6 }}
            >
              <ButtonModalActions onClick={handleClose}>
                Cancelar
              </ButtonModalActions>
              <ButtonModalActions type="submit">Salvar</ButtonModalActions>
            </Stack>
          </Stack>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </DialogContent>
      </Dialog>
      <ActionAlerts
        isOpen={actionAlerts.isOpen}
        title={actionAlerts.title}
        type={actionAlerts.type}
        handleAlert={handleCloseAlert}
      />
    </>
  )
}
