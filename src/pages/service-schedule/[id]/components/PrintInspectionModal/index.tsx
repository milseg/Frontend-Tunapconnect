import { useContext, useRef } from 'react'

import { BoxContainer } from './styles'

import { useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import useMediaQuery from '@mui/material/useMediaQuery'
import { PrintInspection } from '../PrintInspection'
import ReactToPrint from 'react-to-print'
import PrintIcon from '@mui/icons-material/Print'
import { Button } from '@mui/material'

import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
import { ChecklistReturnType } from '@/types/checklist'

interface PrintInspectionModalProps {
  isOpen: boolean
  checkListData: ChecklistReturnType
  handleCloseModalPrintInspectionDefault: () => void
}

export function PrintInspectionModal({
  isOpen,
  handleCloseModalPrintInspectionDefault,
}: PrintInspectionModalProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const { serviceScheduleState } = useContext(ServiceScheduleContext)

  const printInspectionRef = useRef(null)
  console.log(serviceScheduleState)

  return (
    <>
      <Dialog
        // fullScreen={fullScreen}
        fullScreen={fullScreen}
        maxWidth="lg"
        open={isOpen}
        onClose={handleCloseModalPrintInspectionDefault}
        aria-labelledby="responsive-dialog-title"
      >
        {/* <DialogTitle id="responsive-dialog-title">{title}</DialogTitle> */}
        <DialogContent
        // sx={{
        //   width: 400,
        // }}
        >
          <BoxContainer>
            <PrintInspection
              refPrint={printInspectionRef}
              // type="service-schedule"
              checklistData={
                serviceScheduleState.checklist as ChecklistReturnType
              }
            />
          </BoxContainer>
        </DialogContent>
        <DialogActions>
          {/* <Button autoFocus onClick={handleClose}>
            Disagree
          </Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button> */}
          <ReactToPrint
            trigger={() => (
              <Button>
                <PrintIcon />
              </Button>
            )}
            content={() => printInspectionRef.current}
          />
        </DialogActions>
      </Dialog>
    </>
  )
}
