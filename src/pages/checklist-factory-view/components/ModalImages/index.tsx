import {
  Dialog,
  DialogContent,
  ImageList,
  ImageListItem,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface ModalImagesProps {
  isOpen: boolean
  closeModalImages: () => void
  data: string[]
}

export function ModalImages({
  isOpen,
  closeModalImages,
  data,
}: ModalImagesProps) {
  const theme = useTheme()

  console.log(data)

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      onClose={closeModalImages}
      fullWidth={true}
      maxWidth="md"
      scroll={'paper'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          paddingX: 0,
          paddingTop: 0,
          height: 440,
          // overflowY: 'hidden',
        }}
        dividers
      >
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {data.map((item) => (
            <ImageListItem key={item + Math.random() * 2000000}>
              <img
                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </DialogContent>
    </Dialog>
  )
}
