import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import EditIcon from '@mui/icons-material/Edit'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import GroupsIcon from '@mui/icons-material/Groups'
import BusinessIcon from '@mui/icons-material/Business'
import InventoryIcon from '@mui/icons-material/Inventory'
import EngineeringIcon from '@mui/icons-material/Engineering'

export function allRoutes(companySelected: number | null) {
  const routesPaths = [
    {
      path: '/company',
      href: '/company',
      component: <AccountBalanceIcon />,
      title: 'Empresas',
    },
    {
      path: '/service-schedule',
      href: `/service-schedule?company_id=${companySelected}`,
      component: <CalendarMonthIcon />,
      title: 'Agendamento',
    },
    {
      path: '/quotation',
      href: `/quotations?company_id=${companySelected}`,
      component: <RequestQuoteIcon />,
      title: 'Orçamento',
    },
  ]
  return routesPaths
}
export function allRoutesIntranetTunap() {
  const routesPaths = [
    {
      path: '/cadastro',
      href: null,
      component: <EditIcon />,
      title: 'Cadastros',
      submenu: [
        {
          path: '/upload',
          component: <UploadFileIcon />,
          title: 'Upload',
          href: `/upload`,
          submenu: [
            {
              path: '/upload',
              component: null,
              title: 'Upload Toyolex',
              href: `/upload?status=toyolex`,
            },
            {
              path: '/upload/Umuarama',
              component: null,
              title: 'Upload Umuarama',
              href: `/upload?status=umuarama`,
            },
            {
              path: '/upload',
              component: null,
              title: 'Upload Newland',
              href: `/upload?status=newland`,
            },
            {
              path: '/upload',
              component: null,
              title: 'Upload Canopus',
              href: `/upload?status=canopus`,
            },
            {
              path: '/upload',
              component: null,
              title: 'Upload Eurobike',
              href: `/upload?status=eurobike`,
            },
            {
              path: '/upload',
              component: null,
              title: 'Upload Rodobens Auto',
              href: `/upload?status=rodobens_auto`,
            },
          ],
        },
        {
          path: '/grupos',
          component: <GroupsIcon />,
          title: 'Grupos',
          href: `/groups`,
        },
        {
          path: '/tunap_company',
          component: <BusinessIcon />,
          title: 'Empresas',
          href: `/tunap_company`,
        },
        {
          path: '/technical_consultant',
          component: <EngineeringIcon />,
          title: 'Consultores',
          href: `/technical_consultant`,
        },
        {
          path: '/produtos',
          component: <InventoryIcon />,
          title: 'Produtos',
          href: `/produtos`,
        },
      ],
    },
  ]
  return routesPaths
}
