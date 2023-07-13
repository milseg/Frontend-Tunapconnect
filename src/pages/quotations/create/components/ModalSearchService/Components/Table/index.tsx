import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { TableCellHeader, TableRowSBody, TableRowSNoData } from './style'
import { Stack } from '@mui/system'
import { useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

import { ServicesType } from '@/types/quotation'
import { formatMoneyPtBR } from '@/ultis/formatMoneyPtBR'

interface ServicesTableProps {
  handleSelectedService: (product: ServicesType) => void
  data: ServicesType[]
  isLoading: boolean
  handleDoubleClick: () => void
}

export default function ServicesTable({
  data,
  handleSelectedService,
  isLoading,
  handleDoubleClick,
}: ServicesTableProps) {
  const [productSelected, setProductSelected] = useState<number | null>(null)
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
              <TableCellHeader>ID</TableCellHeader>
              <TableCellHeader>Nome</TableCellHeader>
              <TableCellHeader>QTD</TableCellHeader>
              <TableCellHeader>Preço</TableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row) => (
                <TableRowSBody
                  key={row.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                  onClick={(e) => {
                    if (e.detail === 2) {
                      handleDoubleClick()
                    }
                    handleSelectedService(row)
                    setProductSelected(row.id)
                  }}
                  selected={productSelected === row.id}
                >
                  <TableCell scope="row">{row.id}</TableCell>
                  <TableCell scope="row">{row.description}</TableCell>
                  <TableCell scope="row">{row.standard_quantity}</TableCell>
                  <TableCell align="right">
                    {formatMoneyPtBR(Number(row.standard_value))}
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
                        <p>Nenhuma peça encontrada.</p>
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
