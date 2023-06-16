import { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'

import { api } from '@/lib/api'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

interface MyDropzoneProps {
  // dirs?: string[]
  handleAddImageUrlList: (value: {
    id: number
    name: string
    url: string
    size: string
  }) => void
}

// async function savePathTemp(filesList = []) {
//   try {
//     if (!(filesList.length > 0)) return
//     const formData = new FormData()
//     formData.append('image', filesList[0])
//     const { data } = await axios.post('/api/uploadimage', formData)
//   } catch (error: any) {
//   }
// }

export function MyDropzone({ handleAddImageUrlList }: MyDropzoneProps) {
  const onDrop = useCallback(async (acceptedFiles: any) => {
    const formData = new FormData()
    // eslint-disable-next-line no-unused-vars
    acceptedFiles.map((file: File) => {
      formData.append('file', file)
      return file
    })

    api
      .post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        handleAddImageUrlList({
          id: response.data.data.id,
          name: response.data.data.original_name,
          url: response.data.data.url,
          size: response.data.data.size,
        })
      })
      .catch((error) => console.error(error))
  }, [])

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        'image/png': ['.png'],
        'image/jpg': ['.jpg'],
      },
    })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  )

  return (
    // @ts-ignore
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <PhotoSizeSelectActualOutlinedIcon />
      <p>Clique ou arraste para enviar as imagens</p>
    </div>
  )
}
