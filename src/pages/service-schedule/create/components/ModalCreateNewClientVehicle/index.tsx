import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, useForm } from 'react-hook-form'

import { Stack } from '@mui/system'
import { ButtonModalActions, ErrorContainer, InputText } from '../../styles'
import { useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { CompanyContext } from '@/contexts/CompanyContext'
import {
  Backdrop,
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  useMediaQuery,
} from '@mui/material'
import ActionAlerts from '@/components/ActionAlerts'
import { ClientVehicleResponseType } from '../ModalSearchClientVehicle/type'
import { useQuery } from 'react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTheme } from '@mui/material/styles';

interface ModalCreateNewClientVehicleProps {
  handleClose: () => void
  isOpen: boolean
  handleSaveReturnClientVehicle: (client: ClientVehicleResponseType) => void
}

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

const vehicleFormCreateNewSchema = z.object({
  brand: z
    .string()
    .or(z.number())
    .refine((val) => val !== 'none', {
      message: 'Selecione uma marca',
    }),
  model: z
    .string()
    .or(z.number())
    .refine((val) => val !== 'none', {
      message: 'Selecione um modelo',
    }),
  vehicle: z
    .string()
    .or(z.number())
    .refine((val) => val !== 'none', {
      message: 'Selecione um veículo',
    }),
  cor: z.string().min(1, { message: 'Digite uma cor' }),
  chassis: z.string().min(1, { message: 'Digite um chassis' }),
  plate: z.string().min(1, { message: 'Digite uma placa' }),
  km: z
    .string()
    .min(1, { message: 'Digite uma quilometragem' })
    .refine((val) => parseInt(val) >= 0, {
      message: 'Digite um número valido',
    }),
})

export default function ModalCreateNewClientVehicle({
  isOpen,
  handleClose,
  handleSaveReturnClientVehicle,
}: ModalCreateNewClientVehicleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionAlerts, setActionAlerts] = useState<actionAlertsProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })

  const { companySelected } = useContext(CompanyContext)

  const {
    register: registerCreateNewVehicle,
    handleSubmit: handleSubmitCreateNewVehicle,
    reset: resetCreateNewVehicle,
    control: controlCreateNewVehicle,
    watch: watchCreateNewVehicle,
    setValue: setValueCreateNewVehicle,
    formState: { errors: errorsCreateNewVehicle },
  } = useForm({
    resolver: zodResolver(vehicleFormCreateNewSchema),
    defaultValues: {
      brand: 'none',
      model: 'none',
      vehicle: 'none',
      cor: '',
      chassis: '',
      plate: '',
      km: '',
    },
  })

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { data: dataVehicleBrandList } = useQuery<any[]>(
    [
      'service_schedule',
      'create',
      'VehicleModelsList',
      'vehicle',
      companySelected,
    ],
    async () => {
      try {
        const resp = await api.get(
          `/vehicle-brand?company_id=${companySelected}`,
        )
        return resp.data.data
      } catch (err) {}
    },
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
  const { data: dataVehicleModelsList } = useQuery<any[]>(
    [
      'service_schedule',
      'create',
      'VehicleModelsList',
      'vehicleModels',
      companySelected,
      watchCreateNewVehicle('brand'),
    ],
    async () => {
      try {
        // reset({ model: 'none' })
        const resp = await api.get(
          // `/vehicle-model?company_id=${companySelected}`,
          `/vehicle-model/active-vehicle-models?brand_id=${watchCreateNewVehicle(
            'brand',
          )}`,
        )

        // setValue('model', 'none')
        return resp.data.data
      } catch (err) {}
    },
    {
      enabled: watchCreateNewVehicle('brand') !== 'none',
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  const { data: dataVehicleList } = useQuery<any[]>(
    [
      'service_schedule',
      'create',
      'dataVehicleList',
      'vehicleList',
      'model-by-id',
      companySelected,
      watchCreateNewVehicle('model'),
    ],
    async () => {
      try {
        const resp = await api.get(
          `/vehicle/active-vehicles?model_id=${watchCreateNewVehicle('model')}`,
        )

        setValueCreateNewVehicle('vehicle', 'none')

        return resp.data.data
      } catch (err) {}
    },
    {
      enabled: watchCreateNewVehicle('model') !== 'none',
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  async function onSubmit(data: any) {
    try {
      const dataFormatted = {
        chasis: data.chassis,
        vehicle_id: data.vehicle,
        color: data.cor,
        number_motor: null,
        renavan: null,
        plate: data.plate,
        mileage: data.km,
      }
      console.log(dataFormatted)
      const resp = await api.post(
        `/client-vehicle?company_id=${companySelected}`,
        dataFormatted,
      )

      handleSaveReturnClientVehicle(resp.data.data)
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
      resetCreateNewVehicle({
        brand: 'none',
        model: 'none',
        vehicle: 'none',
        cor: '',
        chassis: '',
        plate: '',
        km: '',
      })
    }
  }, [isOpen])

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} fullScreen={fullScreen}>
        <DialogTitle>Criação de Veículo</DialogTitle>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              maxWidth: 550,
              minWidth: fullScreen ? 300: 550,
              margin: '0 auto',
            }}
            gap={1}
            component="form"
            onSubmit={handleSubmitCreateNewVehicle(onSubmit)}
          >
            <Box width="100%">
              <Controller
                name="brand"
                control={controlCreateNewVehicle}
                render={({ field }) => {
                  return (
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Marca"
                      placeholder="Selecione um Consultor"
                      sx={{
                        marginTop: 2,
                        width: '100%',
                      }}
                      {...field}
                      onChange={(event: any) => {
                        setValueCreateNewVehicle('model', 'none')
                        setValueCreateNewVehicle('vehicle', 'none')
                        field.onChange(event)
                      }}
                    >
                      <MenuItem value={'none'}>{'Selecione...'}</MenuItem>
                      {dataVehicleBrandList &&
                        dataVehicleBrandList.map((option) => (
                          <MenuItem
                            key={option.id + option.name}
                            value={option.id}
                          >
                            {option.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  )
                }}
              />
              {errorsCreateNewVehicle.vehicle && (
                <ErrorContainer sx={{ marginTop: 1 }}>
                  {errorsCreateNewVehicle.brand?.message}
                </ErrorContainer>
              )}
            </Box>
            <Box width="100%">
              <Controller
                name="model"
                control={controlCreateNewVehicle}
                render={({ field }) => {
                  return (
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Modelo"
                      placeholder="Selecione um Consultor"
                      sx={{
                        marginTop: 2,
                        width: '100%',
                      }}
                      {...field}
                      onChange={(event: any) => {
                        setValueCreateNewVehicle('vehicle', 'none')
                        field.onChange(event)
                      }}
                    >
                      <MenuItem value={'none'}>{'Selecione...'}</MenuItem>
                      {dataVehicleModelsList &&
                        dataVehicleModelsList.map((option) => (
                          <MenuItem
                            key={option.id + option.name}
                            value={option.id}
                          >
                            {option.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  )
                }}
              />
              {errorsCreateNewVehicle.vehicle && (
                <ErrorContainer sx={{ marginTop: 1 }}>
                  {errorsCreateNewVehicle.model?.message}
                </ErrorContainer>
              )}
            </Box>
            <Box width="100%">
              <Controller
                name="vehicle"
                control={controlCreateNewVehicle}
                render={({ field }) => {
                  return (
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Veículo"
                      placeholder="Selecione..."
                      sx={{
                        marginTop: 2,
                        width: '100%',
                      }}
                      {...field}
                    >
                      <MenuItem value={'none'}>{'Selecione...'}</MenuItem>
                      {dataVehicleList &&
                        dataVehicleList.map((option) => {
                          return (
                            <MenuItem
                              key={option.id + option.name}
                              value={option.id}
                            >
                              {option.name} - {option.model_year}
                            </MenuItem>
                          )
                        })}
                    </TextField>
                  )
                }}
              />
              {errorsCreateNewVehicle.vehicle && (
                <ErrorContainer sx={{ marginTop: 1 }}>
                  {errorsCreateNewVehicle.vehicle?.message}
                </ErrorContainer>
              )}
            </Box>
            <InputText
              label="Cor"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerCreateNewVehicle('cor', { required: true })}
            />
            {errorsCreateNewVehicle.cor && (
              <ErrorContainer sx={{ marginTop: 1 }}>
                {errorsCreateNewVehicle.cor?.message}
              </ErrorContainer>
            )}
            <InputText
              label="CHASSIS"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerCreateNewVehicle('chassis', { required: true })}
            />
            {errorsCreateNewVehicle.chassis && (
              <ErrorContainer sx={{ marginTop: 1 }}>
                {errorsCreateNewVehicle.chassis?.message}
              </ErrorContainer>
            )}
            <InputText
              label="PLACA"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerCreateNewVehicle('plate', { required: true })}
            />
            {errorsCreateNewVehicle.plate && (
              <ErrorContainer sx={{ marginTop: 1 }}>
                {errorsCreateNewVehicle.plate?.message}
              </ErrorContainer>
            )}
            <InputText
              label="KM"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              type="number"
              placeholder="KM"
              InputLabelProps={{
                shrink: true,
              }}
              {...registerCreateNewVehicle('km', { required: true })}
            />
            {errorsCreateNewVehicle.km && (
              <ErrorContainer sx={{ marginTop: 1 }}>
                {errorsCreateNewVehicle.km?.message}
              </ErrorContainer>
            )}
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
