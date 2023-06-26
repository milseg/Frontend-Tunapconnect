import { styled } from '@mui/material/styles'

import { IconButton, TextareaAutosize } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button';

export const TextareaReclamation = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  resize: 'none',
  borderRadius: '4px',
  fontFamily: theme.typography.fontFamily,
}))
export const ButtonTextareaReclamation = styled(IconButton)(({ theme }) => ({
  width: '39px',
  height: '39px',
  padding: '10px',
  fontSize: '16px',
  resize: 'none',
  borderRadius: '4px',
  background: '#0E948B',
  color: '#e0f2f1',
  '&:hover': {
    background: '#1ACABA',
    color: 'white',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    background: '#1ACABA',
    color: 'white',
  },

  '&:disabled': {
    background: '#e0f2f1',
  },
}))
