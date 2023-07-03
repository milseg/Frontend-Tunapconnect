import { styled } from '@mui/material/styles'

import { Typography } from '@mui/material'

export const ErrorContainer = styled(Typography)(({ theme }) => ({
  lineHeight: 1,
  fontSize: 14,
  marginLeft: 5,
  color: 'red',
}))
