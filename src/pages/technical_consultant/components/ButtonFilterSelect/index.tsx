import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { ButtonFilter } from './style'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { DateInput } from '@/components/DateInput'
import { formatDateFilter } from '@/ultis/formatDate'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}))

type filterValuesProps = {
  type: 'dateStart' | 'dateStartAndEnd' | 'dateEnd' | 'text'
  value: string | string[]
}

interface ButtonFilterSelectProps {
  handleFilterValues: (values: filterValuesProps) => any
  isMobile: boolean
}

export function ButtonFilterSelect({
  handleFilterValues,
  isMobile,
}: ButtonFilterSelectProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openModalDateSelect, setOpenModalDateSelect] = useState(false)

  const [dateStart, setDateStart] = useState<Dayjs | null>(dayjs(new Date()))
  const [disableDateStart, setDisableDateStart] = useState(false)

  const [dateEnd, setDateEnd] = useState<Dayjs | null>(dayjs(new Date()))
  const [disableDateEnd, setDisableDateEnd] = useState(false)

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleCloseModalDate = () => {
    setOpenModalDateSelect(false)
    setDisableDateStart(false)
    setDisableDateEnd(false)
  }

  function handleDateStart(data: Dayjs | null) {
    setDateStart(data)
  }
  function handleDateEnd(data: Dayjs | null) {
    setDateEnd(data)
  }

  function handleAddDateValues() {
    if (disableDateStart && !disableDateEnd) {
      handleFilterValues({
        type: 'dateStart',
        value: formatDateFilter(`${dateStart}`),
      })
    }
    if (disableDateEnd && !disableDateStart) {
      handleFilterValues({
        type: 'dateEnd',
        value: formatDateFilter(`${dateEnd}`),
      })
    }

    if (disableDateEnd && disableDateStart) {
      console.log('if')
      handleFilterValues({
        type: 'dateStartAndEnd',
        value: [
          formatDateFilter(`${dateStart}`),
          formatDateFilter(`${dateEnd}`),
        ],
      })
    }

    // date: {
    //   dateStart: !disableDateStart ? null : formatDateFilter(`${dateStart}`),
    //   dateEnd: !disableDateEnd ? null : formatDateFilter(`${dateEnd}`),
    // },
  }

  return (
    <>
      <div>
        <ButtonFilter
          id="demo-customized-button"
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          size="small"
          disableElevation
          onClick={handleClick}
          endIcon={!isMobile ? <KeyboardArrowDownIcon /> : null}
        >
          {isMobile ? <FilterListIcon /> : 'Filtro'}
        </ButtonFilter>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              setOpenModalDateSelect(true)
              handleClose()
            }}
            disableRipple
          >
            <CalendarMonthIcon />
            Data
          </MenuItem>
          {/* <MenuItem onClick={handleClose} disableRipple>
          <FileCopyIcon />
          Duplicate
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <ArchiveIcon />
          Archive
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          More
        </MenuItem> */}
        </StyledMenu>
      </div>
      <Dialog
        open={openModalDateSelect}
        onClose={handleCloseModalDate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Selecione as datas'}
        </DialogTitle>
        <DialogContent>
          <Stack direction="column" gap={2}>
            <Stack
              direction="row"
              gap={2}
              justifyContent="center"
              alignItems="center"
            >
              <Box>
                <Typography>Inicial</Typography>
                <DateInput
                  handleDateSchedule={handleDateStart}
                  dateSchedule={dateStart}
                  disabled={!disableDateStart}
                />
              </Box>
              <Checkbox
                sx={{ marginTop: 3 }}
                onChange={() => setDisableDateStart((prevState) => !prevState)}
                value={disableDateStart}
              />
            </Stack>
            <Stack
              direction="row"
              gap={2}
              justifyContent="center"
              alignItems="center"
            >
              <Box>
                <Typography>Final</Typography>
                <DateInput
                  handleDateSchedule={handleDateEnd}
                  dateSchedule={dateEnd}
                  disabled={!disableDateEnd}
                />
              </Box>
              <Checkbox
                sx={{ marginTop: 3 }}
                onChange={() => setDisableDateEnd((prevState) => !prevState)}
                value={disableDateEnd}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalDate}>cancelar</Button>
          <Button
            onClick={() => {
              handleAddDateValues()
              handleCloseModalDate()
            }}
            autoFocus
          >
            aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
