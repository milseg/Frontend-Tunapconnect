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

export interface GroupType {
  id_group: number
  name: string
  qtd_empresas: number
}

interface GroupsTableProps {
  handleModalNewGroup: () => void
  handleSelectedGroup: (group: GroupType) => void
  data: GroupType[]
  isLoading: boolean
  handleDoubleClick: () => void
}

export default function GruposTable({
  data,
  handleModalNewGroup,
  handleSelectedGroup,
  isLoading,
  handleDoubleClick,
}: GroupsTableProps) {
  const [groupSelected, setGroupSelected] = useState<number | null>(null)
  console.log(data)

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
              <TableCellHeader>Qtd empresas:</TableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row) => (
                <TableRowSBody
                  key={row.id_group}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                  onClick={(e) => {
                    if (e.detail === 2) {
                      handleDoubleClick()
                    }
                    handleSelectedGroup(row)
                    setGroupSelected(row.id_group)
                  }}
                  selected={groupSelected === row.id_group}
                >
                  <TableCell scope="row">{row.name}</TableCell>
                  <TableCell align="left">{row.qtd_empresas}</TableCell>
                </TableRowSBody>
              ))
            ) : (
              <TableRowSNoData>
                <TableCell scope="row" colSpan={2} align="center">
                  <Stack gap={1} alignItems="center" justifyContent="center">
                    {isLoading ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <>
                        <p>Nenhum grupo encontrado</p>
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
