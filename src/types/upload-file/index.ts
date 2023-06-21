export interface UpdateFiles {
  data: string;
  status: string;
  name?: string;
  id: number;
}

export interface IFileListDTO {
  id: string;
  name: string;
}

export interface IPostFile{
  file: File;
  tipo_arquivo: string;
}