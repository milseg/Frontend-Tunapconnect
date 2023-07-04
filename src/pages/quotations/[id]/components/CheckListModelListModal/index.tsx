import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import DialogTitle from '@mui/material/DialogTitle'
import { api } from '@/lib/api'
import { useQuery } from 'react-query'
import { ButtonCancel, ButtonModelChecklist } from './style'
import { Stack } from '@mui/material'
import { ChecklistModelType } from '@/types/checklist'
import { useContext } from 'react'
import { ServiceScheduleContext } from '@/contexts/ServiceScheduleContext'
import { useRouter } from 'next/router'

interface ModalSelectModelChecklistProps {
  isOpen: boolean
  handleClose: () => void
}

export function CheckListModelListModal({
  isOpen,
  handleClose,
}: ModalSelectModelChecklistProps) {
  const router = useRouter()

  const { setCheckListModel, serviceScheduleState } = useContext(
    ServiceScheduleContext,
  )

  const { data: dataChecklistModelList, status: dataChecklistModelListStatus } =
    useQuery<ChecklistModelType[]>({
      queryKey: ['checklist-model-list', 'service_schedule', 'modal'],
      queryFn: async () => {
        try {
          const resp = await api.get('/checklist_model/list')
          return resp.data.data
        } catch (err) {
          console.log(err)
          return []
        }
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    })

  async function handleChecklistModelCreate(data: ChecklistModelType) {
    setCheckListModel(data)
    await router.push(
      `/checklist/create?checklist_model_id=${data.id}&service_schedule_id=${serviceScheduleState?.serviceSchedule?.id}`,
    )
  }

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
                  <ButtonModelChecklist
                    key={index}
                    onClick={() => handleChecklistModelCreate(item)}
                  >
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
