import { useEffect, useState } from 'react'

import Image from 'next/image'

import { ContainerImages } from './style'

interface imageData {
  id: number
  name: string
  url: string
  size: string
}
type positionsTypes =
  | 'frente'
  | 'lateralEsquerdo'
  | 'lateralDireito'
  | 'traseira'
  | 'teto'

interface imagemList {
  frente: imageData[]
  lateralEsquerdo: imageData[]
  lateralDireito: imageData[]
  traseira: imageData[]
  teto: imageData[]
}

interface MyDropzoneProps {
  listImagesUpload: imagemList
  positionsCar: positionsTypes
}

export function InspectionDropzone({
  listImagesUpload,
  positionsCar,
}: MyDropzoneProps) {
  const [list, setList] = useState<imageData[] | []>([])

  useEffect(() => {
    setList(listImagesUpload[positionsCar])
  }, [positionsCar])

  return (
    <>
      <ContainerImages
        sx={{ marginTop: 0.5 }}
        alignItems="flex-start"
        direction="row"
        justifyContent="flex-start"
        gap="3px"
        flexWrap="wrap"
        // height={40}
      >
        {list.length > 0 &&
          list.map((item, index) => {
            return (
              <a
                href={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${item?.url}`}
                target="_blank"
                key={item?.id}
                rel="noreferrer"
              >
                <Image
                  style={{
                    maxWidth: '23px',
                    maxHeight: '22px',
                  }}
                  src={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${item?.url}`}
                  height={22}
                  width={23}
                  // key={item?.id}
                  alt=""
                />
              </a>
            )
          })}
      </ContainerImages>
    </>
  )
}
