import { apiB } from '@/lib/api'
import { IFileListDTO } from '@/types/upload-file';

async function getUploadsList({ pageParam = 1 }): Promise<IFileListDTO[]> {
  const response = await apiB.get<IFileListDTO[]>(
    `/listar_arquivos?status=toyolex&page=${pageParam}&limit=10`,
  );
  return response.data;
}

const uploadFileRequests = {
  getUploadsList,
};

export default uploadFileRequests;
