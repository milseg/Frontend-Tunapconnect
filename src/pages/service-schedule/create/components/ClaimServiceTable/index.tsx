/* eslint-disable no-unused-vars */
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
import { TextareaReclamation } from './styles'
import { useContext, useState } from 'react'
import { ClaimServiceResponseType } from '@/types/service-schedule'
import DeleteIcon from '@mui/icons-material/Delete';
import { Html } from 'next/document'

interface Column {
  id: 'name' | 'code' | 'population' | 'size' | 'density'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },

  // {
  //   id: 'size',
  //   label: 'Size\u00a0(km\u00b2)',
  //   minWidth: 170,
  //   align: 'right',
  //   format: (value: number) => value.toLocaleString('en-US'),
  // },
]

interface Data {
  name: string
  code: string
  population: number
  size: number
  density: number
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number,
): Data {
  const density = population / size
  return { name, code, population, size, density }
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
]

interface ClaimServiceTableProps{
  handleSaveClaimService: (value: string) => void;
  claimServiceList : ClaimServiceResponseType[] | []
  handleRemoveClaimService: (value: number) => void;
}

interface onKeyBoardEventTextArea extends React.KeyboardEvent<HTMLTextAreaElement>  {
  target: EventTarget  & {
    value : string;
  }
}

export default function ClaimServiceTable({ claimServiceList, handleSaveClaimService, handleRemoveClaimService}: ClaimServiceTableProps) {
  const [page, setPage] = useState(0)
  const [claimServices, setClaimServices] = useState<ClaimServiceResponseType[]>([])
  const [textareaReclamationValue, setTextareaReclamationValue] = useState('')
  
  const rowsPerPage = 5

  // const { companySelected } = useContext(CompanyContext)

  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setRowsPerPage(+event.target.value)
  //   setPage(0)
  // }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
      <TextareaReclamation
        id="outlined-multiline-static"
        minRows={1}
        maxRows={6}
        onKeyDown={(e:onKeyBoardEventTextArea) => {
          if (e.ctrlKey && e.key === 'Enter') {
            setTextareaReclamationValue(e.target.value+'\n')
          } else {
            if (e.key === 'Enter' && e.code === 'Enter' ) {
              e.preventDefault()
              handleSaveClaimService(e.target.value)
              setTextareaReclamationValue('')
            } 
          }
        }}
        onChange={(e) => {
          setTextareaReclamationValue(prevState => {
            if(e.target.value[e.target.value.length - 1] === '\n'){
              if(prevState[prevState.length - 1] !== '\n') {
                
                return e.target.value
              }
              if(prevState[prevState.length - 2] === '\n') {
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
            {
            claimServiceList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0 ?
            claimServiceList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover key={row.id}>
                    <TableCell  align='left'>
                      {row.description.includes('\n')? (
                        <span dangerouslySetInnerHTML={{__html: row.description.replace(/\n/g, '<br>')}}></span> 
                      ): row.description}
                    {/* <span dangerouslySetInnerHTML={{__html: row.description.replace(/\n/g, '<br>')}}></span> 
                      {row.description} */}
                    </TableCell>
                    <TableCell  align='right'>
                    <IconButton aria-label="delete" color='error' onClick={() => handleRemoveClaimService(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                    </TableCell>
                  </TableRow>
                )
              }): (
                <TableRow hover >
                <TableCell  align='center' colSpan={2}>
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
          const isNextPage = claimServiceList.length > 0 ? (claimServiceList.length / 5) : 0
          if(page < isNextPage) {
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
