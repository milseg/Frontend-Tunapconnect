import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { ClientResponseType } from '@/types/service-schedule'
import {
  ButtonModalNewClient,
  TableCellHeader,
  TableRowSBody,
  TableRowSNoData,
} from './style'
import { Stack } from '@mui/system'

interface ClientsTableProps {
  handleModalNewClient: () => void
  data: ClientResponseType[]
}

export default function ClientsTable({
  data,
  handleModalNewClient,
}: ClientsTableProps) {
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
              <TableCellHeader>Nome</TableCellHeader>
              <TableCellHeader>CPF:</TableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row) => (
                <TableRowSBody
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => console.log(row)}
                >
                  <TableCell scope="row">{row.name}</TableCell>
                  <TableCell align="right">{row.document}</TableCell>
                </TableRowSBody>
              ))
            ) : (
              <TableRowSNoData>
                <TableCell scope="row" colSpan={2} align="center">
                  <Stack gap={1} alignItems="center" justifyContent="center">
                    <p>Nenhuma cliente encontrado</p>
                    <ButtonModalNewClient
                      onClick={() => handleModalNewClient()}
                    >
                      Adicionar
                    </ButtonModalNewClient>
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
