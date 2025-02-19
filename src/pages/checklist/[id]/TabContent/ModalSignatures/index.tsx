import { Box, Dialog, DialogActions, DialogContent, Stack } from '@mui/material'
import { MyButton } from './styles'

import SignaturePad from 'react-signature-canvas'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Signature {
  name: string
  rules: {
    required: boolean
  }
  image: string
}

interface ModalInspectCarProps {
  isOpen: {
    id: number | null
    open: boolean
  }
  closeModalSignatures: () => void
  stageName: string
  signaturesData: Signature[] | undefined
  stageData: Signature[] | undefined
  handleSaveSignatures: (data: Signature[]) => void
  isClosed: boolean
}

export default function ModalSignatures({
  isOpen,
  closeModalSignatures,
  stageName,
  signaturesData,
  handleSaveSignatures,
  stageData,
  isClosed,
}: ModalInspectCarProps) {
  const signatureRef = useRef<SignaturePad>(null)
  const [isSignature, setIsSignature] = useState<string | null>(null)

  const handleClose = () => {
    closeModalSignatures()
  }
  const handleClear = () => {
    if (signatureRef.current) signatureRef.current?.clear()
    setIsSignature(null)
  }

  function handleSave() {
    if (signatureRef.current) {
      const signature = signatureRef.current
        .getTrimmedCanvas()
        .toDataURL('image/png')
      if (signaturesData) {
        if (signaturesData?.length > 0) {
          const newArraySignatures = signaturesData.map((item, index) => {
            if (isOpen.id === index) {
              return {
                ...item,
                image: signature,
              }
            }
            return item
          })
          handleSaveSignatures(newArraySignatures)
        } else {
          if (stageData) {
            const newArraySignatures = stageData.map((item, index) => {
              if (isOpen.id === index) {
                return {
                  ...item,
                  image: signature,
                }
              }
              return item
            })
            handleSaveSignatures(newArraySignatures)
          }
        }
      } else {
        if (stageData) {
          const newArraySignatures = stageData.map((item, index) => {
            if (isOpen.id === index) {
              return {
                ...item,
                image: signature,
              }
            }
            return item
          })
          handleSaveSignatures(newArraySignatures)
        }
      }
    }
  }

  useEffect(() => {
    if (isOpen?.id !== null) {
      if (signaturesData) {
        if (signaturesData[isOpen.id]?.image.length > 0) {
          setIsSignature(signaturesData[isOpen.id].image)
        } else {
          if (stageData) {
            if (stageData?.length > 0) {
              if (stageData[isOpen.id].image.length > 0) {
                setIsSignature(stageData[isOpen.id].image)
              }
            } else {
              setIsSignature(null)
            }
          }
        }
      }
    }
  }, [isOpen?.id])
  useEffect(() => {
    if (isOpen?.id) {
      if (stageData && !signaturesData) {
        if (stageData[isOpen.id].image)
          setIsSignature(stageData[isOpen.id].image)
      }
    }
  }, [])

  return (
    <Dialog
      open={isOpen.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
      // sx={{
      //   paddingX: 0,
      //   paddingTop: 0,
      // }}
      >
        <Box
          sx={{
            border: '1px solid',
            borderRadius: 1,
            width: 400,
            height: 200,
          }}
        >
          {!isSignature && !isClosed && (
            <SignaturePad
              canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
              ref={signatureRef}
            />
          )}
          {isSignature && (
            <Image
              src={isSignature}
              width={300}
              height={150}
              alt=" "
              style={{ margin: 20 }}
              onClick={() => {
                if (!isClosed) {
                  setIsSignature(null)
                }
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ paddingX: 3, paddingBottom: 2, paddingTop: 0 }}>
        <Stack direction="row" spacing={2}>
          <MyButton
            variant="contained"
            onClick={() => {
              handleSave()
              handleClose()
            }}
            disabled={isClosed}
          >
            salvar
          </MyButton>
          <MyButton variant="contained" onClick={handleClose}>
            sair
          </MyButton>
          <MyButton
            variant="contained"
            onClick={handleClear}
            disabled={isClosed}
          >
            limpar
          </MyButton>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
