import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'

import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'

import { useContext, useEffect, useMemo } from 'react'

import { MainListItems, secondaryListItems } from './ListItems'
import { CompanyContext } from '@/contexts/CompanyContext'
import tunapLogoImg from '@/assets/images/tunap-login.svg'
import Image from 'next/image'
import useMediaQuery from '@mui/material/useMediaQuery'
const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'block',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
      // [theme.breakpoints.up('xs')]: {
      //   width: theme.spacing(9),
      // },
      // [theme.breakpoints.down('md')]: {
      //   width: theme.spacing(0),
      // },
    }),
  },
}))

interface DashboardContentProps {
  children: React.ReactNode
}

export function DashboardContent({ children }: DashboardContentProps) {
  const [open, setOpen] = React.useState(true)

  const toggleDrawer = () => {
    setOpen(!open)
  }
  const theme = useTheme()
  const isWeb = useMediaQuery(theme.breakpoints.up('lg'))
  const { companyData } = useContext(CompanyContext)

  const company = useMemo(() => companyData, [companyData])

  useEffect(() => {
    if (!isWeb) {
      if (open) {
        setOpen(false)
      }
    } else {
      if (!open) {
        setOpen(true)
      }
    }
  }, [isWeb])

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
              color: 'white',
              backgroundColor: '#1C4961',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="white"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {company && `${company?.name ?? 'Não informado'}`}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          // variant="permanent"
          variant="permanent"
          open={open}
          ModalProps={{
            keepMounted: false, // Better open performance on mobile.
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <Image
              src={tunapLogoImg}
              height={30}
              alt="Tunap connect"
              style={{ marginRight: '10px' }}
            />
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems opended={open} />
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          onClick={(e) => {
            if(open) {
              console.log('Tunap open')
              e.stopPropagation()
              setOpen(false)
            }
          }}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            maxWidth: {
              // md: open
              //   ? `calc(100vw - ${drawerWidth}px)`
              //   : `calc(100vw - 71px)`,
              xs: `100vw`,
            },
            marginLeft: {
              // md: open ? `${drawerWidth}px` : '71px',
              xs: 0,
            },
            transition: 'all 0.1s ease-in-out',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  )
}
