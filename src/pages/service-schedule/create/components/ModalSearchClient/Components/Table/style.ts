import { alpha, Button, IconButton, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import TableCell, { tableCellClasses } from '@mui/material/TableCell'

import TableRow from '@mui/material/TableRow'

export const TableCellHeader = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1C4961',
    color: '#fff',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))
// export const TableCellBody = styled(TableCell)(({ theme }) => ({
//   '&: hover': {
//     background: '#1ACABA',
//     color: '#FFF',
//   },
// }))

export const TableRowSBody = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&: hover': {
    background: '#1ACABA',
    color: '#FFF',
    '& td': {
      color: '#FFF',
    },
  },
}))
export const TableRowSNoData = styled(TableRow)(({ theme }) => ({
  height: 100,
}))

export const ButtonModalNewClient = styled(Button)(({ theme }) => ({
  color: 'white',
  background: '#0E948B',
  borderRadius: 4,
  // borderTopLeftRadius: 0,
  // borderBottomLeftRadius: 0,
  padding: '5px 10px',
  textTransform: 'uppercase',
  maxWidth: 100,
  '&:hover': {
    background: '#1ACABA',
  },
  '&:disabled': {
    background: '#e0f2f1',
  },
}))
export const InputNewClient = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}))

export const ButtonAdd = styled(IconButton)(({ theme }) => ({
  height: 55,
  width: 55,
  // maxWidth: 100,
  color: '#0E948B',
  '&:hover': {
    background: '#1ACABA',
    color: 'white',
  },
  '&:disabled': {
    background: '#e0f2f1',
  },
}))

export const ButtonModalActions = styled(Button)(({ theme }) => ({
  color: 'white',
  background: '#0E948B',
  borderRadius: 4,
  // borderTopLeftRadius: 0,
  // borderBottomLeftRadius: 0,
  padding: '5px 10px',
  textTransform: 'uppercase',
  maxWidth: 100,
  '&:hover': {
    background: '#1ACABA',
  },
  '&:disabled': {
    background: '#e0f2f1',
  },
}))
