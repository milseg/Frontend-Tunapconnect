import { styled } from '@mui/material/styles'

import { TextareaAutosize } from '@mui/material'

export const TextareaReclamation = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  maxWidth: '492px',
  resize: 'none',
  borderRadius: '4px',
  fontFamily: theme.typography.fontFamily,
}))
