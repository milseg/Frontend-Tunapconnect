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
import { useContext, useEffect } from 'react'
import { ApiCore } from '@/lib/api'
import { CompanyContext } from '@/contexts/CompanyContext'

interface ModalCreateNewClientProps {
  handleClose: () => void
  isOpen: boolean
}

export default function ModalCreateNewClient({
  isOpen,
  handleClose,
}: ModalCreateNewClientProps) {
  const api = new ApiCore()
  const { companySelected } = useContext(CompanyContext)

  const { register, handleSubmit, control, reset } = useForm({
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
    try {
      const dataFormatted = {
        company_id: companySelected,
        active: true,
        name: data.name,
        document: data.document,
        phone: data.phone.map((item: any) => item.phone),
        email: data.email.map((item: any) => item.email),
        address: data.address.map((item: any) => item.address),
      }
      console.log(dataFormatted)
      const resp = await api.create('/client', dataFormatted)
      console.log(resp)
    } catch (error) {
      console.log(error)
    }
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
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Criação de cliente </DialogTitle>
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
            {...register('name')}
          />
          <InputNewClient
            label="CPF"
            variant="filled"
            style={{ marginTop: 11 }}
            fullWidth
            {...register('document')}
          />
          {fieldsPhone.map((item, index) => {
            console.log(index)
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
            console.log(index)
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
            console.log(index)
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
      </DialogContent>
    </Dialog>
  )
}
