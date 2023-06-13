import * as React from 'react'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ButtonAdd, ButtonModalActions, InputNewClient } from '../style'
import { Stack } from '@mui/system'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'

interface ModalCreateNewClientProps {
  handleClose: () => void
  isOpen: boolean
}

export default function ModalCreateNewClient({
  isOpen,
  handleClose,
}: ModalCreateNewClientProps) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      document: '',
      phone: [{ phone: '' }],
      email: '',
      address: '',
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phone',
  })

  function onSubmit(data: any) {
    console.log(data)
  }

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
          {fields.map((item, index) => {
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
                  <ButtonAdd
                    onClick={() => {
                      append({ phone: '' })
                    }}
                    style={{ marginTop: 12, marginLeft: 10 }}
                  >
                    <AddCircleIcon />
                  </ButtonAdd>
                ) : (
                  <ButtonAdd
                    onClick={() => remove(index)}
                    style={{ marginTop: 12, marginLeft: 10 }}
                  >
                    <DeleteIcon />
                  </ButtonAdd>
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
