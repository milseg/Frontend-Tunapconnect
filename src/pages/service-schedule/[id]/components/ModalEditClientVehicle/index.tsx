import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useForm } from 'react-hook-form'

import { Stack } from '@mui/system'
import { ButtonModalActions, ErrorContainer, InputText } from '../../styles'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Backdrop, CircularProgress, useMediaQuery } from '@mui/material'
import ActionAlerts from '@/components/ActionAlerts'
import { ClientVehicleResponseType } from '../ModalSearchClientVehicle/type'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useTheme } from '@mui/material/styles';

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

const vehicleEditFormSchema = z.object({
  brand: z.string(),
  model: z.string(),
  vehicle: z.string(),
  cor: z.string(),
  chassis: z.string(),
  plate: z.string(),
  km: z
    .string()
    .min(1, { message: 'Digite uma quilometragem' })
    .refine((val) => parseInt(val) >= 0, {
      message: 'Digite um número valido',
    }),
})

export default function ModalEditClientVehicle({
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

  const {
    register: registerEditClientVehicle,
    handleSubmit: handleSubmitEditClientVehicle,
    // control: controlEditClientVehicle,
    // watch: watchEditClientVehicle,
    setValue: setValueEditClientVehicle,
    formState: { errors: errorsEditClientVehicle },
  } = useForm({
    resolver: zodResolver(vehicleEditFormSchema),
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
  // const { data: dataVehicleBrandList, status: dataVehicleBrandListStatus } =
  //   useQuery<any[]>(
  //     [
  //       'service_schedule',
  //       'create',
  //       'VehicleModelsList',
  //       'vehicle',
  //       companySelected,
  //       vehicleData?.id,
  //     ],
  //     async () => {
  //       try {
  //         const resp = await api.get(
  //           `/vehicle-brand?company_id=${companySelected}`,
  //         )
  //         return resp.data.data
  //       } catch (err) {}
  //     },
  //     {
  //       enabled: isOpen,
  //       refetchOnWindowFocus: false,
  //       refetchOnMount: false,
  //       onSuccess: () => {
  //         setValueEditClientVehicle(
  //           'brand',
  //           `${vehicleData?.vehicle?.model?.brand?.id ?? 'none'}`,
  //         )
  //       },
  //     },
  //   )
  // const { data: dataVehicleModelsList } = useQuery<any[]>(
  //   [
  //     'service_schedule',
  //     'edit',
  //     'VehicleModelsList',
  //     'vehicleModels',
  //     companySelected,
  //     vehicleData?.id,
  //     watchEditClientVehicle('brand'),
  //   ],
  //   async () => {
  //     try {
  //       // reset({ model: 'none' })
  //       const resp = await api.get(
  //         `/vehicle-model/active-vehicle-models?brand_id=${watchEditClientVehicle(
  //           'brand',
  //         )}`,
  //       )

  //       // setValue('model', 'none')

  //       return resp.data.data
  //     } catch (err) {}
  //   },
  //   {
  //     enabled: watchEditClientVehicle('brand') !== 'none',
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //     onSuccess: () => {
  //       setValueEditClientVehicle(
  //         'model',
  //         `${vehicleData?.vehicle?.model?.id ?? 'none'}`,
  //       )
  //     },
  //   },
  // )

  // const { data: dataVehicleList, status: dataVehicleListStatus } = useQuery<
  //   any[]
  // >(
  //   [
  //     'service_schedule',
  //     'edit',
  //     'dataVehicleList',
  //     'vehicleList',
  //     'model-by-id',
  //     companySelected,
  //     vehicleData?.id,
  //     watchEditClientVehicle('model'),
  //   ],
  //   async () => {
  //     try {
  //       // reset({ vehicle: 'none' })
  //       const resp = await api.get(
  //         `/vehicle/active-vehicles?model_id=${watchEditClientVehicle(
  //           'model',
  //         )}`,
  //       )

  //       // setValue('vehicle', 'none')

  //       return resp.data.data
  //     } catch (err) {}
  //   },
  //   {
  //     enabled: watchEditClientVehicle('model') !== 'none',
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //     onSuccess: () => {
  //       setValueEditClientVehicle(
  //         'vehicle',
  //         `${vehicleData?.vehicle?.id ?? 'none'}`,
  //       )
  //     },
  //   },
  // )

  async function onSubmit(data: any) {
    try {
      const dataFormatted = {
        chasis: data.chassis,
        vehicle_id: vehicleData?.vehicle?.id,
        color: data.cor,
        number_moto: null,
        renavan: null,
        plate: data.plate,
        mileage: data.km,
      }
      const resp = await api.put(
        `/client-vehicle/${vehicleData?.id}`,
        dataFormatted,
      )

      handleAddClientVehicle(resp.data.data)
      handleSaveEditClientVehicle()
      handleActiveAlert(true, 'success', resp.data.msg)
    } catch (error: any) {
      console.log(error)
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
      setValueEditClientVehicle(
        'brand',
        `${vehicleData?.vehicle?.model?.brand?.name ?? ''}`,
      )
      setValueEditClientVehicle(
        'model',
        `${vehicleData?.vehicle?.model?.name ?? ''}`,
      )
      setValueEditClientVehicle(
        'vehicle',
        `${vehicleData?.vehicle?.name ?? ''}`,
      )
      setValueEditClientVehicle('cor', `${vehicleData?.color ?? ''}`)
      setValueEditClientVehicle('chassis', `${vehicleData?.chasis ?? ''}`)
      setValueEditClientVehicle('plate', `${vehicleData?.plate ?? ''}`)
      setValueEditClientVehicle('km', `${vehicleData?.mileage ?? ''}`)
    }
  }, [isOpen])

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} 
        fullScreen={fullScreen}>
        <DialogTitle>Edição de Veículo</DialogTitle>
        <DialogContent>
          <Stack
            width={400}
            gap={1}
            component="form"
            sx={{
              width: '100%',
              maxWidth: 550,
              minWidth: fullScreen ? 300: 550,
              margin: '0 auto',
            }}
            onSubmit={handleSubmitEditClientVehicle(onSubmit)}
          >
            {/* <Box width="100%">
              <Controller
                name="brand"
                control={controlEditClientVehicle}
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
                        setValueEditClientVehicle('model', 'none')
                        setValueEditClientVehicle('vehicle', 'none')
                        field.onChange(event)
                      }}
                      disabled
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
                control={controlEditClientVehicle}
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
                        setValueEditClientVehicle('vehicle', 'none')
                        field.onChange(event)
                      }}
                      disabled
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
                control={controlEditClientVehicle}
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
                      disabled
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
            </Box> */}
            <InputText
              label="Marca"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerEditClientVehicle('brand')}
              disabled
            />
            <InputText
              label="Modelo"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerEditClientVehicle('model')}
              disabled
            />
            <InputText
              label="Veículo"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerEditClientVehicle('vehicle')}
              disabled
            />
            <InputText
              label="Cor"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerEditClientVehicle('cor', { required: true })}
              disabled
            />
            <InputText
              label="CHASSIS"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerEditClientVehicle('chassis', { required: true })}
              disabled
            />
            <InputText
              label="PLACA"
              variant="filled"
              style={{ marginTop: 11 }}
              fullWidth
              {...registerEditClientVehicle('plate', { required: true })}
              disabled
            />
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
              {...registerEditClientVehicle('km', { required: true })}
            />
            {errorsEditClientVehicle.km && (
              <ErrorContainer sx={{ marginTop: 1 }}>
                {errorsEditClientVehicle.km?.message}
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
