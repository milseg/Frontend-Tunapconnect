import * as React from 'react'

import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import SearchIcon from '@mui/icons-material/Search'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ButtonIcon, ButtonModalDialog } from '../../styles'
import { ApiCore } from '@/lib/api'
import { useContext, useEffect, useState } from 'react'
import { CompanyContext } from '@/contexts/CompanyContext'
import { ClientResponseType } from '@/types/service-schedule'
import ClientsTable from './Components/Table'

interface ModalSearchClienteProps {
  openMolal: boolean
  handleClose: () => void
  handleOpenModalNewClient: () => void
  handleAddClient: (data: ClientResponseType) => void
}

type SearchFormProps = {
  search: string
}

export default function ModalSearchClient({
  openMolal,
  handleClose,
  handleAddClient,
  handleOpenModalNewClient,
}: ModalSearchClienteProps) {
  const [clientList, setClientList] = useState<ClientResponseType[] | []>([])
  const [clientSelected, setClientSelected] =
    useState<ClientResponseType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      search: '',
    },
  })

  const api = new ApiCore()

  const { companySelected } = useContext(CompanyContext)

  async function onSubmitSearch(data: SearchFormProps) {
    setIsLoading(true)
    setClientList([])
    console.log(data)
    try {
      const result = await api.get(
        `/client?company_id=${companySelected}&search=${data.search}`,
      )
      setClientList(result.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClientModal() {
    handleOpenModalNewClient()
    handleClose()
  }

  function handleSelectedClient(client: ClientResponseType) {
    console.log(client)
    setClientSelected(client)
  }

  useEffect(() => {
    if (openMolal) {
      reset({
        search: '',
      })
      setClientList([])
    }
  }, [openMolal])

  return (
    <div>
      <Dialog open={openMolal} onClose={handleClose}>
        <DialogTitle>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            {' '}
            <Typography variant="h6">Buscar por cliente</Typography>
            {clientList.length > 0 && (
              <ButtonModalDialog onClick={handleClientModal}>
                adicionar novo
              </ButtonModalDialog>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitSearch)}
            sx={{
              flexWrap: 'nowrap',
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
          >
            <Stack flexDirection="row" sx={{ marginY: 2 }}>
              <TextField
                id="outlined-size-small"
                size="small"
                sx={{ flex: 1, width: '100%' }}
                {...register('search')}
              />

              <ButtonIcon
                type="submit"
                aria-label="search"
                color="primary"
                sx={{ marginLeft: 1 }}
                disabled={isLoading}
              >
                <SearchIcon />
              </ButtonIcon>
            </Stack>

            <ClientsTable
              data={clientList}
              handleModalNewClient={handleClientModal}
              handleSelectedClient={handleSelectedClient}
              isLoading={isLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <ButtonModalDialog
            onClick={() => {
              handleClose()
              setClientList([])
              setClientSelected(null)
            }}
          >
            Cancel
          </ButtonModalDialog>
          <ButtonModalDialog
            // disabled={clientSelected === null}
            onClick={() => {
              if (clientSelected) {
                handleAddClient(clientSelected)
                handleClose()
                setClientList([])
                setClientSelected(null)
                setValue('search', '')
              }
            }}
          >
            Adicionar
          </ButtonModalDialog>
        </DialogActions>
      </Dialog>
    </div>
  )
}
