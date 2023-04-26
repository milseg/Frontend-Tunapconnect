import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import { MyDropzone } from './DropZone'
import Image from 'next/image'
import { MyButton } from './styles'

type ListImages = Array<{
  id: number
  images: {
    id: number
    name: string
    url: string
    size: string
  }[]
}>

interface IModalImageProps {
  isOpen: { id: number | null; open: boolean }
  closeModalImage: () => void
  handleAddImageInListImage: (
    index: number,
    images: {
      id: number
      name: string
      url: string
      size: string
    },
  ) => void
  handleRemoveImageInListImage: (index: number, idImage: number) => void
  listImage: ListImages
}

export default function ModalImages({
  isOpen,
  closeModalImage,
  handleAddImageInListImage,
  listImage,
  handleRemoveImageInListImage,
}: IModalImageProps) {
  async function handleAddImageUrlList(imageData: {
    id: number
    name: string
    url: string
    size: string
  }) {
    if (isOpen.id) {
      handleAddImageInListImage(isOpen.id, imageData)
    }
  }

  const ImagesActual = listImage.filter((image) => image.id === isOpen.id)[0]

  const handleClose = () => {
    closeModalImage()
  }

  return (
    <Dialog
      open={isOpen.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Imagens'}</DialogTitle>
      <DialogContent>
        <Box>
          <MyDropzone handleAddImageUrlList={handleAddImageUrlList} />
        </Box>
        {ImagesActual?.images.length > 0 ? (
          <Paper
            style={{
              maxHeight: 300,
              overflow: 'auto',
              marginTop: 10,
              padding: '5px 10px 0px 10px',
            }}
          >
            <List>
              {ImagesActual?.images.length > 0
                ? ImagesActual?.images.map((item) => (
                    <ListItem
                      sx={{
                        border: '1px solid #e1e1e1',
                        borderRadius: '2px',
                        px: 1,
                        marginBottom: '5px',
                        overflowY: '',
                        maxHeight: 100,
                      }}
                      key={item.id}
                      dense
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            if (isOpen?.id) {
                              handleRemoveImageInListImage(isOpen?.id, item.id)
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Image
                          alt={item.name}
                          src={item.url}
                          fill
                          style={{
                            maxWidth: '50px',
                            maxHeight: '60px',
                            objectFit: 'scale-down',
                            margin: '0 8px',
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.size} MB`}
                      />
                    </ListItem>
                  ))
                : null}
            </List>
          </Paper>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ paddingX: 3, paddingBottom: 2, paddingTop: 0 }}>
        <Stack direction="row" spacing={2}>
          <MyButton
            variant="contained"
            onClick={() => {
              handleClose()
            }}
          >
            cancelar
          </MyButton>
          <MyButton variant="contained" onClick={handleClose}>
            finalizar
          </MyButton>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}