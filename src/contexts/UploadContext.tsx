import { UploadContextData } from '@/types/upload-file'
import { createContext, ReactNode, useContext, useState } from 'react'

const UploadContext = createContext<UploadContextData>({} as UploadContextData)

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [refetchList, setRefetchList] = useState<boolean>(false)

  return (
    <UploadContext.Provider value={{ refetchList, setRefetchList }}>
      {children}
    </UploadContext.Provider>
  )
}

export const useUploadContext = () => useContext(UploadContext)
