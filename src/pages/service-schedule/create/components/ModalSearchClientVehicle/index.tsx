import * as React from 'react'

import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import SearchIcon from '@mui/icons-material/Search'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, List, ListItemButton, ListItemText, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ButtonIcon, ButtonModalDialog } from '../../styles'
import { ApiCore } from '@/lib/api'
import { useContext, useState } from 'react'
import { CompanyContext } from '@/contexts/CompanyContext'
import { ClientResponseType } from '@/types/service-schedule'

interface ModalSearchClientVehicleProps {
  openMolal: boolean
  handleClose: () => void
  handleAddClientVehicle: (data: ClientResponseType) => void
}

type SearchFormProps = {
  search: string
}

export default function ModalSearchClientVehicle({
  openMolal,
  handleClose,
  handleAddClientVehicle,
}: ModalSearchClientVehicleProps) {
  const [clientVehicleList, setClientVehicleList] = useState<
    ClientResponseType[] | []
  >([])
  const [clientVehicleSelected, setClientVehicleSelected] =
    useState<ClientResponseType | null>(null)

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      search: '',
    },
  })

  const api = new ApiCore()

  const { companySelected } = useContext(CompanyContext)

  async function onSubmitSearch(data: SearchFormProps) {
    console.log(data)
    try {
      const result = await api.get(
        `/client?company_id=${companySelected}&search=${data.search}`,
      )
      console.log(result.data.data)
      setClientVehicleList(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Dialog open={openMolal} onClose={handleClose}>
        <DialogTitle>Buscar por veículo do cliente</DialogTitle>
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
              >
                <SearchIcon />
              </ButtonIcon>
            </Stack>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 },
              }}
              // subheader={<li />}
            >
              <li>
                {clientVehicleList.map((item, index) => (
                  <ListItemButton
                    key={`${index}-${item}`}
                    onClick={() => setClientVehicleSelected(item)}
                    selected={item.id === clientVehicleSelected?.id}
                    sx={{
                      '&.Mui-selected': {
                        background: '#1C4961',
                        color: '#fff',
                        '&:hover': {
                          background: '#1C4961',
                          color: '#fff',
                          opacity: 0.7,
                        },
                      },
                    }}
                  >
                    <ListItemText primary={`${item.name}`} />
                  </ListItemButton>
                ))}
              </li>
            </List>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <ButtonModalDialog
            onClick={() => {
              handleClose()
              setClientVehicleList([])
              setClientVehicleSelected(null)
            }}
          >
            Cancel
          </ButtonModalDialog>
          <ButtonModalDialog
            // disabled={ClientVehicleSelected === null}
            onClick={() => {
              if (clientVehicleSelected) {
                handleAddClientVehicle(clientVehicleSelected)
                handleClose()
                setClientVehicleList([])
                setClientVehicleSelected(null)
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
