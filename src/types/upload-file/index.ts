export interface UpdateFiles {
  cloud_url: string;
  created_at: string;
  filename: string;
  id_file: number;
  original_name: string;
  status: string;
}

export interface IFileListDTO {
  files: IFileProps[];
}
export interface IFileProps{
  cloud_url: string;
  created_at: string;
  filename: string;
  id_file: number;
  original_name: string;
  status: string;
}

export interface IPostFile {
  file: File;
  tipo_arquivo: string;
}
