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
  InputNewClient,
} from '../../styles'
import { useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { CompanyContext } from '@/contexts/CompanyContext'
import { Backdrop, CircularProgress } from '@mui/material'
import ActionAlerts from '@/components/ActionAlerts'
import { ClientResponseType } from '@/types/service-schedule'

interface ModalEditClientProps {
  handleClose: () => void
  handleEditClient: () => void
  isOpen: boolean
  handleAddClient: (client: ClientResponseType) => void
  data: ClientResponseType | null
}

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

export default function ModalEditClient({
  isOpen,
  handleClose,
  handleEditClient,
  handleAddClient,
  data,
}: ModalEditClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionAlerts, setActionAlerts] = useState<actionAlertsProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })

  const { companySelected } = useContext(CompanyContext)

  const { register, handleSubmit, control, setValue } = useForm({
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
        document: formData.document,
        phone: listPhone.length > 0 ? listPhone : null,
        email: listEmail.length > 0 ? listEmail : null,
        address: listAddress.length > 0 ? listAddress : null,
      }

      const resp = await api.put('/client/' + data?.id, dataFormatted)

      handleAddClient(resp.data.data[0])
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
    if (data) {
      setValue('name', data?.name)
      setValue('document', data?.document)
      data?.phone &&
        data?.phone.length > 0 &&
        data?.phone.forEach((item: any, index: number) => {
          updatePhone(index, { phone: item })
        })
      data?.email &&
        data?.email.length > 0 &&
        data?.email.forEach((item: any, index: number) => {
          updateEmail(index, { email: item })
        })
      data?.address &&
        data?.address.length > 0 &&
        data?.address.forEach((item: any, index: number) => {
          updateAddress(index, { address: item })
        })
    }
  }, [isOpen])

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Edição de cliente </DialogTitle>
        <DialogContent>
          <Stack
            width={400}
            gap={1}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputNewClient
              label="Nome"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('name', { required: true })}
            />
            <InputNewClient
              label="CPF"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('document', { required: true })}
            />
            {fieldsPhone.map((item, index) => {
              return (
                <Stack direction="row" key={item.id}>
                  <Controller
                    render={({ field }) => (
                      <InputNewClient
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
                <Stack direction="row" key={item.id}>
                  <Controller
                    render={({ field }) => (
                      <InputNewClient
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
              )
            })}
            {fieldsAddress.map((item, index) => {
              return (
                <Stack direction="row" key={item.id}>
                  <Controller
                    render={({ field }) => (
                      <InputNewClient
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
