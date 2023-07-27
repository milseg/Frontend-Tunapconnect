import { useForm } from 'react-hook-form'

import * as z from 'zod'

import { Stack } from '@mui/system'

import { ButtonModalActions, InputText, ErrorContainer } from './styles'
import { useEffect, useState } from 'react'
import { apiB } from '@/lib/api'

import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ActionAlerts from '@/components/ActionAlerts'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import EditIcon from '@mui/icons-material/Edit'

import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// import { formatCNPJAndCPFNumber } from '@/ultis/formatCNPJAndCPF'

interface actionAlertsProps {
  isOpen: boolean
  title: string
  type: 'success' | 'error' | 'warning'
}

export interface GroupType {
  id_group: number
  name: string
  qtd_empresas: number
}

export interface CompanyGroupType {
  address_1: string
  city: string
  cnpj: string
  created_at: string
  group_name: string
  id: number
  id_group: number
  id_responsible: number
  integration_code: string
  name: string
  province: string
  responsible_name: string
  updated_at: string
}

const newClientFormSchema = z.object({
  // name: z
  //   .string()
  //   .nonempty({ message: 'Digite um nome!' })
  //   .min(3, { message: 'Digite um nome valido!' }),
  // integration_code: z
  //   .string()
  //   .nonempty({ message: 'Digite um nome!' })
  //   .min(3, { message: 'Digite um nome valido!' }),
  // document: z.string().refine(
  //   (e) => {
  //     if (validateCNPJ(e)) {
  //       return true
  //     }
  //     return false
  //   },
  //   { message: 'Digite um valor valido!' },
  // ),
})

newClientFormSchema.required({
  name: true,
  document: true,
})

export default function EditCompanyById() {
  const [isLoading, setIsLoading] = useState(false)
  const [companyList, setCompanyList] = useState<CompanyGroupType[]>([])

  const { data: dataSession } = useSession()
  console.log(dataSession)

  const [actionAlerts, setActionAlerts] = useState<actionAlertsProps>({
    isOpen: false,
    title: '',
    type: 'success',
  })

  const {
    register,
    handleSubmit,
    setValue,
    // reset,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(newClientFormSchema),
    defaultValues: {
      name: '',
      document: '',
      integration_code: '',
    },
  })

  const router = useRouter()

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  async function onSubmit(dataForm: any) {
    // setIsLoading(true)
    console.log(dataForm)
    try {
      const dataFormatted = {
        name: dataForm.name,
      }
      console.log(dataFormatted)

      const result = await apiB.put(
        `/groups/${router.query.id}`,
        dataFormatted,
        // dataFormatted,
      )

      console.log(result)

      handleActiveAlert(true, 'success', `${result.data.message}`)
    } catch (error: any) {
      if (error.response.status === 400) {
        handleActiveAlert(true, 'error', error.response.data.message)
      } else {
        handleActiveAlert(true, 'error', error.response.data.message)
      }
      setIsLoading(false)
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
    async function getData() {
      try {
        const result = await apiB.get(`/groups/${router.query.id}`)
        console.log(result.data.group)
        // name: '',
        // document: '',
        // integration_code: '',
        // setData(result.data.company)
        setCompanyList(result.data.group.companies as CompanyGroupType[])

        setValue('name', result.data.group.name)
        // // setValue('document', result.data.cnpj)
        // setValue('document', conformedCNPJNumber(result.data.company.cnpj))
        // setValue('integration_code', result.data.company.integration_code)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [router.query.id])

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">Edição de Grupo</Typography>
        <Stack
          gap={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: 550,
            minWidth: fullScreen ? 300 : 550,
            margin: '20px auto',
          }}
        >
          <label>
            Nome
            <InputText
              variant="outlined"
              style={{ marginTop: 2 }}
              fullWidth
              error={!!errors.name}
              {...register('name')}
            />
            <ErrorContainer>{errors.integration_code?.message}</ErrorContainer>
          </label>

          <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
            {/* <ButtonModalActions onClick={handleClose}>
              Cancelar
            </ButtonModalActions> */}
            <ButtonModalActions type="submit">Salvar</ButtonModalActions>
          </Stack>
        </Stack>
        {companyList.length > 0 && (
          <>
            <Typography variant="h6">Empresas do Grupo</Typography>
            <TableContainer
              component={Paper}
              sx={{ maxWidth: 550, marginTop: 2, marginBottom: 5 }}
            >
              <Table
                sx={{ minWidth: 550 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead
                  sx={{
                    background: '#1C4961',
                    color: '#FFF',
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        color: '#FFF',
                      }}
                    >
                      Nome
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#FFF',
                      }}
                      align="left"
                    >
                      CNPJ
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#FFF',
                      }}
                      align="left"
                    >
                      Responsável
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#FFF',
                      }}
                      align="left"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyList.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.cnpj}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.responsible_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {/* @ts */}
                        {dataSession &&
                          Number(dataSession?.user?.id) ===
                            Number(row.id_responsible) && (
                            <Link
                              href={`/tunap_company/${row.id}`}
                              prefetch={false}
                            >
                              <IconButton
                                aria-label="search"
                                color="warning"
                                // onClick={() =>
                                //   openDialogEdit(group.id_group, group.name)
                                // }
                                sx={{
                                  marginLeft: 1,
                                  color: 'blue',
                                }}
                              >
                                <EditIcon
                                  style={{
                                    width: 20,
                                    height: 20,
                                  }}
                                />
                              </IconButton>
                            </Link>
                          )}
                      </TableCell>
                      {/* <TableCell align="right">
                        {dataSession?.user?.id === row.id_responsible
                          ? dataSession?.user?.id
                          : dataSession?.user?.id}
                      </TableCell> */}

                      {/* <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>

      <ActionAlerts
        isOpen={actionAlerts.isOpen}
        title={actionAlerts.title}
        type={actionAlerts.type}
        handleAlert={handleCloseAlert}
      />
    </>
  )
}
EditCompanyById.auth = true
