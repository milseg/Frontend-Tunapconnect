import * as React from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'

import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import EditIcon from '@mui/icons-material/Edit'

import { ChevronRight, ExpandMore, StarBorder } from '@mui/icons-material'


import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ListItemButton } from './styles'
import { CompanyContext } from '@/contexts/CompanyContext'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'

import { AuthContext } from '@/contexts/AuthContext'


type memuListProps = Array<{
  path: string
  href: string
  component: React.ReactNode
  title: string
}>

export const MainListItems = ({ opended }: { opended: boolean }) => {
  const [routeActual, setRouteActual] = useState('')
  const router = useRouter()
  const { companySelected } = useContext(CompanyContext)
  const { listCompanies, addCompaniesList, user } = useContext(AuthContext)
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);

  const memuList: memuListProps = useMemo(
    () => {
      let ret = [
        {
          path: '/company',
          href: '/company',
          component: <AccountBalanceIcon />,
          title: 'Empresas',
        }
        // {
        //   path: '/checklist',
        //   href: '/checklist',
        //   component: <AccessTimeFilledOutlinedIcon />,
        //   title: 'Checklist',
        // },
      ]
      if(companySelected) {
        ret.push({
          path: '/service-schedule',
          href: `/service-schedule?company_id=${companySelected}`,
          component: <CalendarMonthIcon />,
          title: 'Agendamento',
        })
      }
      if(user?.userTunap) {
        ret.push({
          path: '/upload',
          href: `/upload?status=toyolex`,
          component: <UploadFileIcon />,
          title: 'Cadastros',
        })
      }
      
      return ret
    },
    [companySelected],
  )

  const menuListCompanyId = useMemo(
    () =>
      memuList.map((item) => {
        return item.path === '/company'
          ? item
          : {
              ...item,
              href: `${item.href}`,
            }
      }),
    [companySelected],
  )

  const handleRegisterClick = () => {
    setRegisterOpen(!registerOpen)
  }

  const handleUploadClick = () => {
    setUploadOpen(!uploadOpen)
  }

  useEffect(() => {
    setRouteActual(router.pathname)
  }, [router])

  return (
    <React.Fragment>
      {menuListCompanyId.map((menu, index) => {
        return (
          menu.path === '/upload' ? (
            <React.Fragment key={index}>
              <ListItemButton
                  selected={routeActual.includes(menu.path)}
                  sx={{
                    ...(opended && { margin: '10px 20px' }),
                  }}
                  onClick={handleRegisterClick}
              >
                <ListItemIcon><EditIcon /></ListItemIcon>
                <ListItemText primary={menu.title} style={{ color: 'white' }} />
                {registerOpen ? <ExpandMore /> : <ChevronRight />}
              </ListItemButton>
              <Collapse in={registerOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton 
                    sx={{ 
                      pl: 4, marginLeft: '40px', width: 'fit-content'
                    }}
                    onClick={handleUploadClick}
                  >
                    <ListItemIcon>
                        {menu.component}
                    </ListItemIcon>
                    <ListItemText primary="Upload" />
                    {uploadOpen ? <ExpandMore /> : <ChevronRight />}
                  </ListItemButton>
                </List>
              </Collapse>
              <Collapse in={uploadOpen && registerOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Link href={menu.href} style={{ textDecoration: 'none' }}>
                    <ListItemButton sx={{ pl: 4, marginLeft: '70px', width: 'fit-content'}}>
                      <ListItemText primary="Upload Toyolex" />
                    </ListItemButton>
                  </Link>
                </List>
              </Collapse>
            </React.Fragment>
            ) : (
              <Link href={menu.href} key={index} style={{ textDecoration: 'none' }}>
                <ListItemButton
                  selected={routeActual.includes(menu.path)}
                  sx={{
                    ...(opended && { margin: '10px 20px' }),
                  }}
                >
                  <ListItemIcon>{menu.component}</ListItemIcon>
                  <ListItemText primary={menu.title} style={{ color: 'white' }} />
                </ListItemButton>
              </Link>
            )
        )
      })}
    </React.Fragment>
  )
}

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset></ListSubheader>
    <ListItemButton onClick={() => signOut({ callbackUrl: '/' })}>
      <ListItemIcon>
        <ExitToAppOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Sair" />
    </ListItemButton>
  </React.Fragment>
)
