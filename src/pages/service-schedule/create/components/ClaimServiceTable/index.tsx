import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

import { IconButton, Stack } from '@mui/material'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { ButtonTextareaReclamation, TextareaReclamation } from './styles'
import { useState } from 'react'
import { ClaimServiceResponseType } from '@/types/service-schedule'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

// interface Column {
//   id: 'name'
//   label: string
//   minWidth?: number
//   align?: 'right'
//   format?: (value: number) => string
// }

// const columns: readonly Column[] = [
//   { id: 'name', label: 'Name', minWidth: 170 },

//   // {
//   //   id: 'size',
//   //   label: 'Size\u00a0(km\u00b2)',
//   //   minWidth: 170,
//   //   align: 'right',
//   //   format: (value: number) => value.toLocaleString('en-US'),
//   // },
// ]

interface ClaimServiceTableProps {
  handleSaveClaimService: (value: string) => void
  claimServiceList: ClaimServiceResponseType[] | []
  handleRemoveClaimService: (value: number) => void
}

interface onKeyBoardEventTextArea
  extends React.KeyboardEvent<HTMLTextAreaElement> {
  target: EventTarget & {
    value: string
  }
}

export default function ClaimServiceTable({
  claimServiceList,
  handleSaveClaimService,
  handleRemoveClaimService,
}: ClaimServiceTableProps) {
  const [page, setPage] = useState(0)
  const [textareaReclamationValue, setTextareaReclamationValue] = useState('')

  const rowsPerPage = 5

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
      <Stack direction="row" gap={1} sx={{ marginBottom: 1 }}>
        <TextareaReclamation
          id="outlined-multiline-static"
          minRows={1}
          maxRows={6}
          onKeyDown={(e: onKeyBoardEventTextArea) => {
            if (e.ctrlKey && e.key === 'Enter') {
              setTextareaReclamationValue(e.target.value + '\n')
            } else {
              if (e.key === 'Enter' && e.code === 'Enter') {
                e.preventDefault()
                handleSaveClaimService(e.target.value)
                setTextareaReclamationValue('')
              }
            }
          }}
          onChange={(e) => {
            setTextareaReclamationValue((prevState) => {
              if (e.target.value[e.target.value.length - 1] === '\n') {
                if (prevState[prevState.length - 1] !== '\n') {
                  return e.target.value
                }
                if (prevState[prevState.length - 2] === '\n') {
                  return e.target.value
                }
                return prevState
              } else {
                return e.target.value
              }
            })
          }}
          value={textareaReclamationValue}
        />
        <ButtonTextareaReclamation
          onClick={() => {
            handleSaveClaimService(textareaReclamationValue)
            setTextareaReclamationValue('')
          }}
        >
          <AddIcon />
        </ButtonTextareaReclamation>
      </Stack>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          {/* <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead> */}
          <TableBody>
            {claimServiceList.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage,
            ).length > 0 ? (
              claimServiceList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell align="left">
                        {row?.description.includes('\n')
                          ? row.description
                              .split(/(\n)/g)
                              .map((item, index) => {
                                return item === '\n' ? (
                                  <br
                                    key={Math.random() * 2000 + '-' + index}
                                  />
                                ) : (
                                  <span
                                    key={Math.random() * 2000 + '-' + index}
                                  >
                                    {item}
                                  </span>
                                )
                              })
                          : row.description}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => handleRemoveClaimService(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Sem reclamações
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="center" gap={1} marginTop={2}>
        <IconButton
          onClick={() => {
            if (page - 1 >= 0) {
              setPage(page - 1)
            }
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            const isNextPage =
              claimServiceList.length > 0 ? claimServiceList.length / 5 : 0
            if (page < isNextPage) {
              setPage(page + 1)
            }
          }}
          // disabled={DisableButtonNext}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}
