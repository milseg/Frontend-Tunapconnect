import {
  Dialog,
  DialogContent,
  ImageList,
  ImageListItem,
  // useMediaQuery,
} from '@mui/material'
// import { useTheme } from '@mui/material/styles'

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
  // const theme = useTheme()

  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      open={isOpen}
      // fullScreen={fullScreen}
      onClose={closeModalImages}
      fullWidth={true}
      maxWidth="xs"
      scroll={'paper'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          paddingX: 0,
          paddingTop: 0,
          height: 440,
          width: 440,
        }}
        dividers
      >
        <ImageList sx={{ width: 420, height: 450 }} cols={2} rowHeight={164}>
          {data.map((item) => (
            <ImageListItem
              key={item + Math.random() * 2000000}
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${item}`,
                  '_blank',
                )
              }
            >
              <img
                src={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${item}?w=164&h=164&fit=crop&auto=format`}
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
