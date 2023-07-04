/* eslint-disable no-unused-vars */
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
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'

import ChevronRight from '@mui/icons-material/ChevronRight'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'

import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'

import { CompanyContext } from '@/contexts/CompanyContext'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'

import { AuthContext } from '@/contexts/AuthContext'
import { useUploadContext } from '@/contexts/UploadContext'
import { allRoutes, allRoutesIntranetTunap } from './Menus'
import { ListItemButton } from '../styles'

type memuListProps = Array<{
  path: string
  href: string | null
  component: React.ReactNode
  title: string
  submenu?: {
    path: string
    href: string | null
    component: React.ReactNode
    title: string
    submenu?: {
      path: string
      href: string | null
      component: React.ReactNode | null
      title: string
    }[]
  }[]
}>

export const MainListItems = ({ opended }: { opended: boolean }) => {
  const [routeActual, setRouteActual] = useState('')
  const router = useRouter()
  const { companySelected, deselectCompany } = useContext(CompanyContext)
  const { listCompanies, addCompaniesList, user } = useContext(AuthContext)
  const { refetchList, setRefetchList } = useUploadContext()
  const [uploadOpen, setUploadOpen] = useState<boolean>(false)
  const [openSubmenu, setOpenSubmenu] = useState<{
    nivel1: string | null | true
    nivel2: string | null
  }>({
    nivel1: null,
    nivel2: null,
  })
  const [registerOpen, setRegisterOpen] = useState<boolean>(false)

  const menuList: memuListProps = useMemo(() => {
    const menuRoutes = allRoutes(companySelected)
    console.log(routeActual)
    if (routeActual !== '/company') {
      return menuRoutes
    }
    return menuRoutes.filter((r) => r.path === '/company')
  }, [companySelected, routeActual])

  const menuListTunapIntranet: memuListProps = useMemo(() => {
    const menuRoutes = allRoutesIntranetTunap()

    return menuRoutes
  }, [user?.userTunap])

  const handleOpenSubmenu = (value: {
    nivel1: string | null | true
    nivel2: string | null
  }) => {
    console.log(value)
    setOpenSubmenu((prevState) => {
      if (value.nivel1 === true && prevState.nivel2 === value.nivel2) {
        return {
          nivel1: prevState.nivel1,
          nivel2: null,
        }
      }
      if (value.nivel1 === true && prevState.nivel2 === null) {
        return {
          nivel1: prevState.nivel1,
          nivel2: value.nivel2,
        }
      }
      if (value.nivel1 === prevState.nivel1 && prevState.nivel2 === null) {
        return {
          nivel1: null,
          nivel2: null,
        }
      }
      if (value.nivel2 === prevState.nivel2 && value.nivel1 === true) {
        return {
          nivel1: prevState.nivel1,
          nivel2: null,
        }
      }
      return {
        nivel1: value.nivel1,
        nivel2: value.nivel2,
      }
    })
  }

  const handleRegisterClick = () => {
    setRegisterOpen(!registerOpen)
  }

  const handleUploadClick = () => {
    setUploadOpen(!uploadOpen)
  }

  const handleListReload = () => {
    setRefetchList(!refetchList)
  }

  useEffect(() => {
    if (routeActual !== '/company' && router.pathname === '/company') {
      deselectCompany()
    }
    setRouteActual(router.pathname)
  }, [router])

  useEffect(() => {
    console.log(openSubmenu)
  }, [openSubmenu])

  return (
    <React.Fragment>
      {menuList.map((menu, index) => {
        return (
          <Link
            href={menu.href ?? ''}
            key={index}
            style={{ textDecoration: 'none' }}
          >
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
      })}

      {user?.userTunap &&
        menuListTunapIntranet.map((menu, index) => {
          console.log(menu)
          return (
            <React.Fragment key={index}>
              {menu.href !== null ? (
                <Link
                  href={menu.href}
                  key={index}
                  style={{ textDecoration: 'none' }}
                >
                  <ListItemButton
                    selected={routeActual.includes(menu.path)}
                    sx={{
                      ...(opended && { margin: '10px 20px' }),
                    }}
                  >
                    <ListItemIcon>{menu.component}</ListItemIcon>
                    <ListItemText
                      primary={menu.title}
                      style={{ color: 'white' }}
                    />
                  </ListItemButton>
                </Link>
              ) : (
                <>
                  <ListItemButton
                    selected={routeActual.includes(menu.path)}
                    sx={{
                      ...(opended && { margin: '10px 20px' }),
                    }}
                    onClick={() => {
                      console.log(menu?.path)
                      handleOpenSubmenu({
                        nivel1: menu?.path as string,
                        nivel2: null,
                      })
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={menu.title}
                      style={{ color: 'white' }}
                    />
                    {openSubmenu.nivel1 === menu.path ? (
                      <ExpandMore />
                    ) : (
                      <ChevronRight />
                    )}
                  </ListItemButton>
                  <Collapse
                    in={openSubmenu.nivel1 === menu.path}
                    timeout="auto"
                    unmountOnExit
                    key={menu.title + Math.random() * 20000}
                  >
                    <List component="div" disablePadding>
                      {menu.submenu &&
                        menu?.submenu?.length > 0 &&
                        menu?.submenu.map((sub, index) => {
                          return (
                            <>
                              <ListItemButton
                                sx={{
                                  pl: 4,
                                  marginLeft: '40px',
                                  width: 'fit-content',
                                }}
                                onClick={() => {
                                  console.log(menu?.path)
                                  handleOpenSubmenu({
                                    nivel1: true,
                                    nivel2: sub.path,
                                  })
                                }}
                              >
                                <ListItemIcon>{menu.component}</ListItemIcon>
                                <ListItemText primary={sub.title} />
                                {openSubmenu.nivel2 === sub.path ? (
                                  <ExpandMore />
                                ) : (
                                  <ChevronRight />
                                )}
                              </ListItemButton>
                              {sub.submenu && sub?.submenu?.length > 0 && (
                                <Collapse
                                  in={openSubmenu.nivel2 === sub.path}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <List component="div" disablePadding>
                                    {sub?.submenu.map((subSubmenu, index) => {
                                      return subSubmenu.href !== null ? (
                                        <Link
                                          href={subSubmenu.href ?? ''}
                                          style={{ textDecoration: 'none' }}
                                          onClick={handleListReload}
                                        >
                                          <ListItemButton
                                            sx={{
                                              pl: 4,
                                              marginLeft: '70px',
                                              width: 'fit-content',
                                            }}
                                          >
                                            <ListItemText
                                              primary={subSubmenu.title}
                                            />
                                          </ListItemButton>
                                        </Link>
                                      ) : (
                                        <ListItemButton
                                          sx={{
                                            pl: 4,
                                            marginLeft: '70px',
                                            width: 'fit-content',
                                          }}
                                        >
                                          <ListItemText
                                            primary={subSubmenu.title}
                                          />
                                        </ListItemButton>
                                      )
                                    })}
                                  </List>
                                </Collapse>
                              )}
                            </>
                          )
                        })}
                    </List>
                  </Collapse>
                </>
              )}
            </React.Fragment>
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
