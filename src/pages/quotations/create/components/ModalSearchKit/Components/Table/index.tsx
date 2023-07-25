import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import {
  MuiAccordionDetails,
  MuiAccordionStyled,
  MuiAccordionSummary,
  TableCellHeader,
  TableRowSBody,
  TableRowSNoData,
} from './style'
import { Stack } from '@mui/system'

import { Box, CircularProgress, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { KitType } from '@/types/quotation'

interface KitTableProps {
  handleSelectedKit: (kit: KitType) => void
  data: KitType[]
  isLoading: boolean
  handleDoubleClick: () => void
}

export default function KitTable({
  data,
  handleSelectedKit,
  isLoading,
  handleDoubleClick,
}: KitTableProps) {
  const [expanded, setExpanded] = React.useState<number | false>(false)

  const handleChange =
    (panel: KitType) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      handleSelectedKit(panel)
      setExpanded(newExpanded ? panel.kit_id : false)
    }

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 350, maxHeight: 350 }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCellHeader>Kits</TableCellHeader>

              {/* <TableCellHeader>Preço</TableCellHeader> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row) => (
                <TableRowSBody
                  key={row.kit_id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                  // onClick={(e) => {
                  //   if (e.detail === 2) {
                  //     handleDoubleClick()
                  //   }
                  //   handleSelectedKit(row)
                  //   setKitSelected(row.kit_id)
                  // }}
                  // selected={kitSelected === row.kit_id}
                >
                  <TableCell
                    scope="row"
                    sx={{
                      padding: 0,
                    }}
                  >
                    <MuiAccordionStyled
                      expanded={expanded === row.kit_id}
                      onChange={handleChange(row)}
                    >
                      <MuiAccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                          // display: 'flex',
                          // alignItems: 'center',
                          // justifyContent: 'space-between',
                          background:
                            expanded === row.kit_id ? '#1ACABA' : '#fff',
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            flex: 1,
                          }}
                        >
                          {row.name}
                        </Typography>
                      </MuiAccordionSummary>
                      <MuiAccordionDetails>
                        <Table
                          // sx={{ minWidth: 650 }}
                          size="small"
                          aria-label="a dense table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Cod.</TableCell>
                              <TableCell align="left">Nome</TableCell>
                              <TableCell align="right">QTD</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.products.length > 0 && (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  colSpan={3}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Peças
                                </TableCell>
                              </TableRow>
                            )}
                            {row.products.map((p, index) => (
                              <TableRow
                                key={
                                  p.product.id + '-' + p.product.product_code
                                }
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {p.product.product_code}
                                </TableCell>
                                <TableCell component="th" align="left">
                                  {p.product.name ?? 'Não informado'}
                                </TableCell>
                                <TableCell component="th" align="right">
                                  {p.quantity}
                                </TableCell>
                              </TableRow>
                            ))}

                            {row.services.length > 0 && (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  colSpan={3}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Serviços
                                </TableCell>
                              </TableRow>
                            )}
                            {row.services.map((s, index) => (
                              <TableRow
                                key={s.service.description + s.service.id}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {s.service.service_code}
                                </TableCell>
                                <TableCell component="th" align="left">
                                  {s.service.description ?? 'Não informado'}
                                </TableCell>
                                <TableCell component="th" align="right">
                                  {s.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </MuiAccordionDetails>
                    </MuiAccordionStyled>
                  </TableCell>
                </TableRowSBody>
              ))
            ) : (
              <TableRowSNoData>
                <TableCell scope="row" colSpan={3} align="center">
                  <Stack gap={1} alignItems="center" justifyContent="center">
                    {isLoading ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <>
                        <p>Nenhuma kit encontrado.</p>
                        {/* <ButtonModalNewClient
                          onClick={() => handleModalNewClient()}
                        >
                          adicionar novo
                        </ButtonModalNewClient> */}
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRowSNoData>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
