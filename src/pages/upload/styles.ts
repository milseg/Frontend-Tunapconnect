import styled from '@emotion/styled'
import { Paper } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

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

export const TableTitles = styled(Paper)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '8px 22px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#1C4961',
  borderColor: '#1C4961',
  justifyItems: 'flex-end',
  alignItems: 'center',
  color: 'white',
})

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
