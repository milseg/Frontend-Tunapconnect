import { styled } from '@mui/material/styles'

import { Button } from '@mui/material'

export const ButtonModelChecklist = styled(Button)(({ theme }) => ({
  color: 'white',
  background: '#0E948B',
  borderRadius: 4,
  // borderTopLeftRadius: 0,
  // borderBottomLeftRadius: 0,
  padding: '10px 20px',
  textTransform: 'uppercase',
  '&:hover': {
    background: '#1ACABA',
  },
}))

export const ButtonCancel = styled(Button)(({ theme }) => ({
  color: 'white',
  background: '#0E948B',
  fontSize: '0.75rem',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // borderTopLeftRadius: 0,
  // borderBottomLeftRadius: 0,
  padding: '6px 20px',
  textTransform: 'uppercase',
  '&:hover': {
    background: '#1ACABA',
  },
}))
