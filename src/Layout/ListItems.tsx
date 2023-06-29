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

import ChevronRight from '@mui/icons-material/ChevronRight'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'


import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ListItemButton } from './styles'
import { CompanyContext } from '@/contexts/CompanyContext'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'

import { AuthContext } from '@/contexts/AuthContext'
import { useUploadContext } from '@/contexts/UploadContext'


type memuListProps = Array<{
  path: string
  href: string
  component: React.ReactNode
  title: string
}>

export const MainListItems = ({ opended }: { opended: boolean }) => {
  const [routeActual, setRouteActual] = useState('')
  const router = useRouter()
  const { companySelected, deselectCompany } = useContext(CompanyContext)
  const { listCompanies, addCompaniesList, user } = useContext(AuthContext)
  const {refetchList,setRefetchList} = useUploadContext();
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);

  const memuList: memuListProps = useMemo(
    () => {
      //console.log("listItems routeActual", routeActual)
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
      //console.log("routeActual", routeActual, "companySelected", companySelected)
      //if(routeActual !== '/company' && companySelected) {
        //console.log("pushRoute")
      ret.push({
        path: '/service-schedule',
        href: `/service-schedule?company_id=${companySelected}`,
        component: <CalendarMonthIcon />,
        title: 'Agendamento',
      })
      //}
      if(user?.userTunap) {
        ret.push({
          path: '/upload',
          href: `/upload`,
          component: <UploadFileIcon />,
          title: 'Cadastros',
        })
      }
      
      return ret
    },
    [companySelected, routeActual],
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

  const handleListReload = ()=>{
    setRefetchList(!refetchList);
  }

  useEffect(() => {
    if(routeActual !== '/company' && router.pathname === '/company') {
      //console.log("deselectCompany()")
      deselectCompany()
    }
    setRouteActual(router.pathname)
  }, [router])

  return (
    <React.Fragment>
      {menuListCompanyId.map((menu, index) => {
        return (
          menu.path === '/upload' ? (routeActual !== '/service-schedule' && (
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
                  <Link href={`${menu.href}?status=toyolex`} style={{ textDecoration: 'none' }}  onClick={handleListReload}>
                    <ListItemButton sx={{ pl: 4, marginLeft: '70px', width: 'fit-content'}}>
                      <ListItemText primary="Upload Toyolex" />
                    </ListItemButton>
                  </Link>
                  <Link href={`${menu.href}?status=umuarama`} style={{ textDecoration: 'none' }}  onClick={handleListReload}>
                    <ListItemButton sx={{ pl: 4, marginLeft: '70px', width: 'fit-content'}}>
                      <ListItemText primary="Upload Umuarama" />
                    </ListItemButton>
                  </Link>
                  <Link href={`${menu.href}?status=newland`} style={{ textDecoration: 'none' }}  onClick={handleListReload}>
                    <ListItemButton sx={{ pl: 4, marginLeft: '70px', width: 'fit-content'}}>
                      <ListItemText primary="Upload Newland" />
                    </ListItemButton>
                  </Link>
                </List>
              </Collapse>
            </React.Fragment>
            )) : (menu.path !== '/service-schedule' || (routeActual !== '/company' && routeActual !== '/upload' && companySelected)) && (
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
