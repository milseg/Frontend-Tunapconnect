import * as React from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'

import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { signOut } from 'next-auth/react'

import ChevronRight from '@mui/icons-material/ChevronRight'
import ExpandMore from '@mui/icons-material/ExpandMore'

import Link from 'next/link'
import { useState } from 'react'
import { ListItemButton } from '../styles'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import { useRouter } from 'next/router'

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

interface ButtonsMenuNavProps {
  menuList: memuListProps
  opended: boolean
  routeActual: string
}

export const ButtonsMenuNav = ({
  menuList,
  opended,
  routeActual,
}: ButtonsMenuNavProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<{
    nivel1: string | null | true
    nivel2: string | null
  }>({
    nivel1: null,
    nivel2: null,
  })

  const router = useRouter()

  const handleOpenSubmenu = (value: {
    nivel1: string | null | true
    nivel2: string | null
  }) => {
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

  return (
    <React.Fragment>
      {menuList &&
        menuList.map((menu, index) => {
          return (
            <React.Fragment key={index + Math.random() * 20000}>
              {menu.href !== null ? (
                <Link href={menu.href} style={{ textDecoration: 'none' }}>
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
                    // selected={
                    //   openSubmenu.nivel1 === menu.path &&
                    //   openSubmenu.nivel2 === null
                    // }
                    sx={{
                      ...(opended && { margin: '10px 20px' }),
                    }}
                    onClick={() => {
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
                            <React.Fragment key={Math.random() * 20000}>
                              {(sub.path === '/grupos' ||
                                sub.path === '/empresas' ||
                                sub.path === '/produtos') &&
                              sub.href ? (
                                <Link
                                  href={sub.href}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <ListItemButton
                                    selected={routeActual.includes(sub.path)}
                                    sx={{
                                      pl: 4,
                                      marginLeft: '40px',
                                      width: 'fit-content',
                                    }}
                                  >
                                    <ListItemIcon>{sub.component}</ListItemIcon>
                                    <ListItemText
                                      primary={sub.title}
                                      style={{ color: 'white' }}
                                    />
                                  </ListItemButton>
                                </Link>
                              ) : (
                                <ListItemButton
                                  sx={{
                                    pl: 4,
                                    marginLeft: '40px',
                                    width: 'fit-content',
                                  }}
                                  onClick={() => {
                                    handleOpenSubmenu({
                                      nivel1: true,
                                      nivel2: sub.path,
                                    })
                                  }}
                                  // selected={openSubmenu.nivel2 === sub.path}
                                >
                                  <ListItemIcon>{menu.component}</ListItemIcon>
                                  <ListItemText primary={sub.title} />
                                  {openSubmenu.nivel2 === sub.path ? (
                                    <ExpandMore />
                                  ) : (
                                    <ChevronRight />
                                  )}
                                </ListItemButton>
                              )}

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
                                          key={
                                            subSubmenu.title +
                                            Math.random() * 20000
                                          }
                                        >
                                          <ListItemButton
                                            sx={{
                                              pl: 4,
                                              marginLeft: '70px',
                                              width: 'fit-content',
                                            }}
                                            selected={
                                              router.asPath === subSubmenu.href
                                            }
                                          >
                                            <ListItemText
                                              primary={subSubmenu.title}
                                            />
                                          </ListItemButton>
                                        </Link>
                                      ) : (
                                        <ListItemButton
                                          key={
                                            subSubmenu.title +
                                            Math.random() * 20000
                                          }
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
                            </React.Fragment>
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
