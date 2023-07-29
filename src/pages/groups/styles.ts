import styled from '@emotion/styled'
import { Paper } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { alpha } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

export const SearchButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#0E948B',
  borderColor: '#0E948B',
})

export const paginationButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '12px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#F1F1F1',
  borderColor: '#F1F1F1',
  width: '52px',
  height: '52px',
})

export const TableTitles = styled(Paper)`
  box-shadow: none;
  text-transform: none;
  font-size: 16;
  padding: 8px 22px;
  border: 1px solid;
  line-height: 1.5;
  background-color: #1c4961;
  border-color: #1c4961;
  justify-items: flex-end;
  align-items: center;
  color: white;
  @media screen and (max-width: 780px) {
    padding: 8px 12px;
  }
`

export const UploadFileField = styled(TextField)({
  width: '0.1px',
  height: '0.1px',
  opacity: 0,
  overflow: 'hidden',
  position: 'absolute',
  zIndex: -1,
})

export const CustomLabel = styled.label`
  width: 60%;
  height: 100%;
  font-size: 1rem;
  text-align: center;
  align-items: center;
  display: flex;
  border: 1px solid black;
  border-radius: 0.4rem;
  padding: 2px 3px;
  @media screen and (max-width: 780px) {
    width: 100%;
  }
`

export const FormUpdate = styled.form`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 780px) {
    flex-direction: column;
    row-gap: 2rem;
    align-items: flex-start;
  }
`
export const ButtonIcon = styled(IconButton)(({ theme }) => ({
  color: 'white',
  background: '#1C4961',
  borderRadius: 4,
  '&:hover': {
    background: alpha('#1C4961', 0.7),
  },
}))

export const ButtonAdd = styled(Button)(({ theme }) => ({
  color: 'white',
  background: '#1C4961',
  borderRadius: 4,
  '&:hover': {
    background: alpha('#1C4961', 0.7),
  },
}))
