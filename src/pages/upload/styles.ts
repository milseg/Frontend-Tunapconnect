import styled from '@emotion/styled'
import { Paper } from '@mui/material';
import Button from '@mui/material/Button';

export const SearchButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0E948B',
    borderColor: '#0E948B',
});

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
    color: 'white'
});
