import * as React from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'

import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

import { useContext, useEffect, useMemo, useState } from 'react'

import { CompanyContext } from '@/contexts/CompanyContext'

import { AuthContext } from '@/contexts/AuthContext'
import { allRoutes, allRoutesIntranetTunap } from './Menus'
import { ListItemButton } from '../styles'
import { ButtonsMenuNav } from './ButtonsMenuNav'

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
  const { user } = useContext(AuthContext)

  const menuList: memuListProps = useMemo(() => {
    const menuRoutes = allRoutes(companySelected)
    if (routeActual !== '/company') {
      return menuRoutes
    }
    return menuRoutes.filter((r) => r.path === '/company')
  }, [companySelected, routeActual])

  const menuListTunapIntranet: memuListProps = useMemo(() => {
    const menuRoutes = allRoutesIntranetTunap()

    return menuRoutes
  }, [])

  // const handleOpenSubmenu = (value: {
  //   nivel1: string | null | true
  //   nivel2: string | null
  // }) => {
  //   console.log(value)
  //   setOpenSubmenu((prevState) => {
  //     if (value.nivel1 === true && prevState.nivel2 === value.nivel2) {
  //       return {
  //         nivel1: prevState.nivel1,
  //         nivel2: null,
  //       }
  //     }
  //     if (value.nivel1 === true && prevState.nivel2 === null) {
  //       return {
  //         nivel1: prevState.nivel1,
  //         nivel2: value.nivel2,
  //       }
  //     }
  //     if (value.nivel1 === prevState.nivel1 && prevState.nivel2 === null) {
  //       return {
  //         nivel1: null,
  //         nivel2: null,
  //       }
  //     }
  //     if (value.nivel2 === prevState.nivel2 && value.nivel1 === true) {
  //       return {
  //         nivel1: prevState.nivel1,
  //         nivel2: null,
  //       }
  //     }
  //     return {
  //       nivel1: value.nivel1,
  //       nivel2: value.nivel2,
  //     }
  //   })
  // }

  // const handleRegisterClick = () => {
  //   setRegisterOpen(!registerOpen)
  // }

  // const handleUploadClick = () => {
  //   setUploadOpen(!uploadOpen)
  // }

  // const handleListReload = () => {
  //   setRefetchList(!refetchList)
  // }

  useEffect(() => {
    if (routeActual !== '/company' && router.pathname === '/company') {
      deselectCompany()
    }
    setRouteActual(router.pathname)
  }, [router])

  return (
    <React.Fragment>
      <ButtonsMenuNav
        menuList={menuList}
        opended={opended}
        routeActual={routeActual}
      />
      {user?.user_tunap && router.asPath === '/company' && (
        <ButtonsMenuNav
          menuList={menuListTunapIntranet}
          opended={opended}
          routeActual={routeActual}
        />
      )}
      {/* {user?.user_tunap &&
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
                    <ListItemIcon>{menu.component}</ListItemIcon>
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
        })} */}
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
