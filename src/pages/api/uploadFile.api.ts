import { apiB } from "@/lib/api";
import { IFileListDTO } from "@/types/upload-file";

async function getUploadsList({ queryKey }: any): Promise<IFileListDTO> {
  const response = await apiB.get<IFileListDTO>(
    `/listar_arquivos?status=${queryKey[3]}&page=${queryKey[1]}&limit=10`
  );
  return response.data;
}

const uploadFileRequests = {
  getUploadsList,
};

export default uploadFileRequests;
