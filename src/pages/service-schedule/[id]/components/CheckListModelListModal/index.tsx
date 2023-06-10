import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import DialogTitle from '@mui/material/DialogTitle'
import { ApiCore } from '@/lib/api'
import { useQuery } from 'react-query'
import { ButtonCancel, ButtonModelChecklist } from './style'
import { Stack } from '@mui/material'
import { ChecklistModelType } from '@/types/checklist'

interface ModalSelectModelChecklistProps {
  isOpen: boolean
  handleClose: () => void
}

export function CheckListModelListModal({
  isOpen,
  handleClose,
}: ModalSelectModelChecklistProps) {
  const api = new ApiCore()

  const { data: dataChecklistModelList, status: dataChecklistModelListStatus } =
    useQuery<ChecklistModelType[]>({
      queryKey: ['checklist-model-list', 'service_schedule', 'modal'],
      queryFn: async () => {
        try {
          const resp = await api.get('/checklist_model/list')
          console.log(resp.data.data)
          return resp.data.data
        } catch (err) {
          console.log(err)
          return []
        }
      },
      // enabled: isOpen,
    })

  return (
    <>
      <Dialog
        open={isOpen && dataChecklistModelListStatus === 'success'}
        onClose={handleClose}
      >
        <DialogTitle>Lista de modelos de checklist</DialogTitle>
        <DialogContent>
          <Stack gap={2} marginTop={1} marginBottom={2}>
            {dataChecklistModelList &&
              dataChecklistModelList.map((item, index) => {
                return (
                  <ButtonModelChecklist key={index}>
                    {' '}
                    {item.name}
                  </ButtonModelChecklist>
                )
              })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <ButtonCancel onClick={handleClose}>Cancelar</ButtonCancel>
        </DialogActions>
      </Dialog>
    </>
  )
}
