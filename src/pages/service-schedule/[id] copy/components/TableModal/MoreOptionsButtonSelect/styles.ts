import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
// import IconButton from "@mui/material/IconButton";

export const MenuItemButton = styled(MenuItem)(({ theme }) => ({
  borderRadius: 4,

  '&:hover': {
    background: '#1ACABA',
    color: 'white',
  },
}))
