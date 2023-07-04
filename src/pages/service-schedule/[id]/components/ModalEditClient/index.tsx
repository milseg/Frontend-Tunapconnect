import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Stack } from '@mui/system'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import {
  ButtonAddInputs,
  ButtonModalActions,
  ErrorContainer,
  InputText,
} from '../../styles'
import { useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { CompanyContext } from '@/contexts/CompanyContext'
import {
  Backdrop,
  CircularProgress,
  InputAdornment,
  useMediaQuery,
} from '@mui/material'
import ActionAlerts from '@/components/ActionAlerts'
import { ClientResponseType } from '@/types/service-schedule'

import * as z from 'zod'
import { validateCNPJ, validateCPF } from '@/ultis/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextMaskPHONE, TextMaskCPF } from '@/components/InputMask'
import { useTheme } from '@mui/material/styles'

interface ModalEditClientProps {
  handleClose: () => void
  handleEditClient: () => void
  isOpen: boolean
  handleAddClient: (client: ClientResponseType) => void
  clientData: ClientResponseType | null
}

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

const editClientFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Digite um nome!' })
    .min(5, { message: 'Digite um nome valido!' }),
  document: z.string().refine(
    (e) => {
      if (validateCPF(e)) {
        return true
      }
      if (validateCNPJ(e)) {
        return true
      }
      return false
    },
    { message: 'CPF inválido!' },
  ),
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

editClientFormSchema.required({
  name: true,
  document: true,
})

export default function ModalEditClient({
  isOpen,
  handleClose,
  handleEditClient,
  handleAddClient,
  clientData,
}: ModalEditClientProps) {
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
    setValue,
    formState: { errors: errorsEditClient },
  } = useForm({
    resolver: zodResolver(editClientFormSchema),
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
    update: updatePhone,
  } = useFieldArray({
    control,
    name: 'phone',
  })

  const {
    fields: fieldsEmail,
    append: appendEmail,
    remove: removeEmail,
    update: updateEmail,
  } = useFieldArray({
    control,
    name: 'email',
  })
  const {
    fields: fieldsAddress,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({
    control,
    name: 'address',
  })

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  async function onSubmit(formData: any) {
    setIsLoading(true)
    const listPhone = formData.phone
      .map((item: any) => item.phone)
      .filter((item: any) => item !== '')

    const listEmail = formData.email
      .map((item: any) => item.email)
      .filter((item: any) => item !== '')

    const listAddress = formData.address
      .map((item: any) => item.address)
      .filter((item: any) => item !== '')

    try {
      const dataFormatted = {
        company_id: companySelected,
        active: true,
        name: formData.name,
        document: Number(clientData?.document as string),
        phone: listPhone.length > 0 ? listPhone : null,
        email: listEmail.length > 0 ? listEmail : null,
        address: listAddress.length > 0 ? listAddress : null,
      }

      const resp = await api.put('/client/' + clientData?.id, dataFormatted)

      handleAddClient(resp.data.data)
      handleEditClient()
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
    if (clientData) {
      setValue('name', clientData?.name)
      setValue('document', clientData?.document)
      clientData?.phone &&
        clientData?.phone.length > 0 &&
        clientData?.phone.forEach((item: any, index: number) => {
          updatePhone(index, { phone: item })
        })
      clientData?.email &&
        clientData?.email.length > 0 &&
        clientData?.email.forEach((item: any, index: number) => {
          updateEmail(index, { email: item })
        })
      clientData?.address &&
        clientData?.address.length > 0 &&
        clientData?.address.forEach((item: any, index: number) => {
          updateAddress(index, { address: item })
        })
    }
  }, [isOpen])

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} fullScreen={fullScreen}>
        <DialogTitle>Edição de cliente</DialogTitle>
        <DialogContent>
          <Stack
            width={400}
            gap={1}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: '100%',
              maxWidth: 550,
              minWidth: fullScreen ? 300 : 550,
              margin: '0 auto',
            }}
          >
            <InputText
              label="Nome"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('name', { required: true })}
            />
            <ErrorContainer>{errorsEditClient.name?.message}</ErrorContainer>
            <InputText
              label="CPF"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('document', { required: true })}
              focused
              disabled
              InputProps={{
                // @ts-ignore
                inputComponent: TextMaskCPF,
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            />
            <ErrorContainer>
              {errorsEditClient.document?.message}
            </ErrorContainer>
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
                        InputProps={{
                          // @ts-ignore
                          inputComponent: TextMaskPHONE,
                        }}
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
                  <Stack direction="row">
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
                    {errorsEditClient?.email &&
                      errorsEditClient?.email[index]?.email?.message}
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
