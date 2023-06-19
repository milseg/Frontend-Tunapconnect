import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, useForm } from 'react-hook-form'

import { Stack } from '@mui/system'
import { ButtonModalActions, InputNewClient } from '../../styles'
import { useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { CompanyContext } from '@/contexts/CompanyContext'
import {
  Backdrop,
  Box,
  CircularProgress,
  MenuItem,
  TextField,
} from '@mui/material'
import ActionAlerts from '@/components/ActionAlerts'
import { ClientVehicleResponseType } from '../ModalSearchClientVehicle/type'
import { useQuery } from 'react-query'

interface ModalCreateEditClientVehicleProps {
  handleClose: () => void
  handleSaveEditClientVehicle: () => void
  isOpen: boolean
  handleAddClientVehicle: (client: ClientVehicleResponseType) => void
  vehicleData: ClientVehicleResponseType | null | undefined
}

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

export default function ModalCreateEditClientVehicle({
  isOpen,
  handleClose,
  handleSaveEditClientVehicle,
  handleAddClientVehicle,
  vehicleData,
}: ModalCreateEditClientVehicleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionAlerts, setActionAlerts] = useState<actionAlertsProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })

  const { companySelected } = useContext(CompanyContext)

  const { register, handleSubmit, control, watch, setValue } = useForm({
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

  const { data: dataVehicleBrandList, status: dataVehicleBrandListStatus } =
    useQuery<any[]>(
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
      watch('brand'),
    ],
    async () => {
      try {
        // reset({ model: 'none' })
        const resp = await api.get(
          // `/vehicle-model?company_id=${companySelected}`,
          `/vehicle-model/active-vehicle-models?brand_id=${watch('brand')}`,
        )

        // setValue('model', 'none')

        return resp.data.data
      } catch (err) {}
    },
    {
      enabled: watch('brand') !== 'none',
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  console.log(watch('vehicle'))

  const { data: dataVehicleList } = useQuery<any[]>(
    [
      'service_schedule',
      'create',
      'dataVehicleList',
      'vehicleList',
      'model-by-id',
      companySelected,
      watch('model'),
    ],
    async () => {
      try {
        // reset({ vehicle: 'none' })
        const resp = await api.get(
          `/vehicle/active-vehicles?model_id=${watch('model')}`,
        )

        // setValue('vehicle', 'none')

        return resp.data.data
      } catch (err) {}
    },
    {
      enabled: watch('model') !== 'none',
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  async function onSubmit(data: any) {
    try {
      const dataFormatted = {
        chasis: data.chasis,
        vehicle_id: data.vehicle,
        color: data.cor,
        plate: data.plate,
        mileage: data.km,
      }
      const resp = await api.post(
        `/client-vehicle?company_id=${companySelected}`,
        dataFormatted,
      )

      handleAddClientVehicle(resp.data.data[0])
      handleSaveEditClientVehicle()
      handleActiveAlert(true, 'success', resp.data.msg)
      console.log(dataFormatted)
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
      // reset({
      //   brand: `${vehicleData?.vehicle?.model?.brand?.id ?? 'none'}`,
      //   model: `${vehicleData?.vehicle?.model?.id ?? 'none'}`,
      //   vehicle: `${vehicleData?.vehicle?.id ?? 'none'}`,
      //   cor: `${vehicleData?.color ?? ''}`,
      //   chassis: `${vehicleData?.chasis ?? ''}`,
      //   plate: `${vehicleData?.plate ?? ''}`,
      //   km: `${vehicleData?.mileage ?? ''}`,
      // })
      setValue('brand', `${vehicleData?.vehicle?.model?.brand?.id ?? 'none'}`)
      setValue('model', `${vehicleData?.vehicle?.model?.id ?? 'none'}`)
      setValue('vehicle', `${vehicleData?.vehicle?.id ?? 'none'}`)
      setValue('cor', `${vehicleData?.color ?? ''}`)
      setValue('chassis', `${vehicleData?.chasis ?? ''}`)
      setValue('plate', `${vehicleData?.plate ?? ''}`)
      setValue('km', `${vehicleData?.mileage ?? ''}`)
    }
  }, [isOpen])

  return (
    <>
      <Dialog
        open={isOpen && dataVehicleBrandListStatus === 'success'}
        onClose={handleClose}
      >
        <DialogTitle>Criação de Veículo</DialogTitle>
        <DialogContent>
          <Stack
            width={400}
            gap={1}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box width="100%">
              <Controller
                name="brand"
                control={control}
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
                        setValue('model', 'none')
                        setValue('vehicle', 'none')
                        field.onChange(event)
                      }}
                    >
                      <MenuItem value={'none'}>
                        {'Selecione um Consultor'}
                      </MenuItem>
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
            </Box>
            <Box width="100%">
              <Controller
                name="model"
                control={control}
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
                        setValue('vehicle', 'none')
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
            </Box>
            <Box width="100%">
              <Controller
                name="vehicle"
                control={control}
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
                          console.log(option)
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
            </Box>
            <InputNewClient
              label="Cor"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('cor', { required: true })}
            />
            <InputNewClient
              label="CHASSIS"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('chassis', { required: true })}
            />
            <InputNewClient
              label="PLACA"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('plate', { required: true })}
            />
            <InputNewClient
              label="KM"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...register('km', { required: true })}
            />

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
