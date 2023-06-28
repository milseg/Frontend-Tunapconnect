import * as React from 'react'
import { useContext, useMemo } from 'react'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  useGridApiRef,
} from '@mui/x-data-grid'

import { BoxContainer, StyledGridOverlay, TableDataGrid } from './styles'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import DialogTitle from '@mui/material/DialogTitle'

import { MoreOptionsButtonSelect } from './MoreOptionsButtonSelect'
import { api } from '@/lib/api'
import { useQuery } from 'react-query'
import { formatDateTime } from '@/ultis/formatDate'
import { CompanyContext } from '@/contexts/CompanyContext'
import { Box } from '@mui/material'
import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'

import { useRouter } from 'next/router'

interface TableAppProps {
  isOpen: boolean
  title: string
  serviceScheduleId: string
  closeChecklistModal: () => void
}

declare module '@mui/x-data-grid' {
  // eslint-disable-next-line no-unused-vars
  interface FooterPropsOverrides {
    // @ts-ignore
    // handlePages: (nextPage: string) => void
    nextPage: boolean
    previousPage: boolean
  }
}

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 2, mb: 1 }}>Nenhum checklist encontrado</Box>
    </StyledGridOverlay>
  )
}

export function TableModal({
  isOpen,
  title,
  closeChecklistModal,
  serviceScheduleId,
}: TableAppProps) {
  // const theme = useTheme()
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  // const [list, setList] = useState()

  const { companySelected } = useContext(CompanyContext)
  const { setCheckList } = useContext(ServiceScheduleContext)
  const router = useRouter()

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Código',
        headerClassName: 'super-app-theme--header',
        width: 90,
        type: 'number',
        align: 'center',
        sortable: false,
      },
      {
        field: 'createAt',
        headerName: 'Data',
        headerClassName: 'super-app-theme--header',
        // flex: 1,
        maxWidth: 280,
        minWidth: 180,
        sortable: false,
        valueFormatter: (params: GridValueFormatterParams) => {
          if (params.value == null) {
            return 'Não informado'
          }

          const dateFormatted = formatDateTime(params.value)
          return `${dateFormatted}`
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'super-app-theme--header',
        width: 120,
        sortable: false,
      },
      {
        field: 'action',
        headerName: 'Ação',
        headerClassName: 'super-app-theme--header',
        sortable: false,
        width: 80,
        align: 'left',
        renderCell: (params: GridRenderCellParams) => {
          const idCell = params.id
          return (
            <MoreOptionsButtonSelect
              checklistId={idCell as number}
              status={params.row.status}
              handleDeleteChecklist={handleDeleteChecklist}
              handleEditChecklist={handleEditChecklist}
              handlePrintChecklist={handlePrintChecklist}
            />
          )
        },
      },
    ],
    [isOpen, handleEditChecklist, handlePrintChecklist],
  )

  // const router = useRouter()

  const apiRef = useGridApiRef()

  async function handleDeleteChecklist(checklistId: number) {
    try {
      await api.delete('/checklist/' + checklistId)
      refetch()
    } catch (err) {
      console.log(err)
      throw new Error(`Falha ao excluir`)
      // alert(`Falha ao excluir`)
    }
  }

  const {
    data: dataCheckList,
    isLoading,
    status: dataCheckListStatus,
    refetch,
  } = useQuery({
    queryKey: [
      'checklist',
      'service_schedule',
      'by_id',
      'modal',
      companySelected,
      serviceScheduleId,
    ],
    queryFn: async () => {
      try {
        const resp = await api.get(
          `/checklist/list?company_id=${companySelected}&service_schedule_id=${serviceScheduleId}&orderby=updated_at desc`,
        )

        const rowFormatted = resp.data.data.map((row: any) => {
          return {
            id: row?.id,
            createAt: row?.created_at,
            status: `${row?.status[0].toUpperCase()}${row?.status.substring(
              1,
            )}`,
          }
        })
        return {
          checklistAllData: resp.data.data,
          checklistRows: rowFormatted,
        }
      } catch (err) {
        console.log(err)
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  async function handleEditChecklist(idChecklistSelected: number) {
    const checklistFiltered = dataCheckList?.checklistAllData.filter(
      (c: any) => c.id === idChecklistSelected,
    )[0]

    if (checklistFiltered) {
      setCheckList(checklistFiltered)

      await router.push(`/checklist/${idChecklistSelected}`)
    }
  }
  async function handlePrintChecklist(idChecklistSelected: number) {
    const checklistFiltered = dataCheckList?.checklistAllData.filter(
      (c: any) => c.id === idChecklistSelected,
    )[0]
    if (checklistFiltered) {
      setCheckList(checklistFiltered)
    }
  }

  return (
    <>
      <Dialog
        // fullScreen={fullScreen}
        maxWidth="lg"
        open={isOpen && dataCheckListStatus === 'success'}
        onClose={closeChecklistModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent
        // sx={{
        //   width: 400,
        // }}
        >
          <BoxContainer>
            <TableDataGrid
              rows={
                dataCheckListStatus === 'success' &&
                dataCheckList?.checklistRows.length > 0
                  ? dataCheckList?.checklistRows
                  : []
              }
              columns={columns}
              autoHeight
              columnHeaderHeight={70}
              disableColumnMenu
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
              }}
              // slots={{
              //   noRowsOverlay: CustomNoRowsOverlay,
              //   footer: CustomFooterStatusComponent,
              // }}
              // slotProps={{
              //   footer: { nextPage: pages?.next, previousPage: pages?.previous, handlePages }
              // }}
              
              apiRef={apiRef}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 7,
                  },
                },
              }}
              loading={isLoading}
              // onRowClick={(id) => {
              //   // router.push(`/service-schedules/${id.id}`)
              // }}
              pageSizeOptions={[7]}
              disableRowSelectionOnClick
              disableColumnFilter
              // getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
            />
          </BoxContainer>
        </DialogContent>
        <DialogActions>
          {/* <Button autoFocus onClick={closeChecklistModal}>
            Disagree
          </Button>
          <Button onClick={closeChecklistModal} autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  )
}
