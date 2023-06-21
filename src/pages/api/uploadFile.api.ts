import { api } from '@/lib/api'
import { IFileListDTO } from '@/types/upload-file';

async function getUploadsList({ pageParam = 1 }): Promise<IFileListDTO[]> {
  console.log(pageParam);
  const response = await api.get<IFileListDTO[]>(
    `/listar_arquivos?status=toyolex&page=${pageParam}&limit=10`,
  );
  return response.data;
}

const uploadFileRequests = {
  getUploadsList,
};

export default uploadFileRequests;
