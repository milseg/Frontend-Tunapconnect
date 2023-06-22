import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Container, Grid, Stack, Typography } from "@mui/material";
import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  CustomLabel,
  FormUpdate,
  SearchButton,
  TableTitles,
  UploadFileField,
} from "./styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { IFileProps } from "@/types/upload-file";
import { useMutation, useQuery, useQueryClient } from "react-query";
import uploadFileRequests from "../api/uploadFile.api";
import { apiB } from "@/lib/api";
import { ButtonPaginate } from "../service-schedule/create/styles";
import { Loading } from "@/components/Loading";

export default function Upload() {
  const [currentFile, setCurrentFile] = useState<File>(new File([], ""));
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = React.useState(1);

  const [fileName, setFileName] = useState<string>(
    "Nenhum arquivo selecionado (selecione aqui)"
  );

  const queryClient = useQueryClient();

  const { data: filesListDTO, isFetching } = useQuery({
    queryKey: ["uploadFileQuery", pageNumber],
    queryFn: uploadFileRequests.getUploadsList,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
  });

  const handleUpload = (e: any) => {
    e.preventDefault();
    let formData: FormData = new FormData();
    formData.append("file", currentFile);
    formData.append("tipo_arquivo", "toyolex");
    if (
      currentFile &&
      fileName !== "Nenhum arquivo selecionado (selecione aqui)"
    ) {
      handleAddFile(formData);
    }
  };

  const handleImport = (event: any) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    if (selectedFiles.length) {
      setCurrentFile(selectedFiles[0]);
      setFileName(selectedFiles[0].name);
    }
    console.log(filesListDTO);
  };

  const updateFilesUploadMutation = useMutation(
    (fd: FormData) => {
      return apiB
        .post(`/upload_arquivos`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          return resp.data[1].message;
        });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("uploadFileQuery");
        setIsUploading(false);
        setFileName("Nenhum arquivo selecionado (selecione aqui)");
        console.log("sucess");
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  async function handleAddFile(stageData: FormData) {
    // @ts-ignore
    setIsUploading(true);
    updateFilesUploadMutation.mutate(stageData);
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Stack direction="column" spacing={6}>
          <Stack direction="column" spacing={2}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" component="h2" fontWeight={700}>
                {"Upload - Toyolex"}
              </Typography>
              <Typography>
                {"TUNAP Connect > Intranet > Upload > Upload - Toyolex"}
              </Typography>
            </Grid>
            <Paper
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "row",
                height: "fit-content",
              }}
            >
              <FormUpdate>
                <CustomLabel>
                  {fileName}
                  <UploadFileField
                    InputProps={{
                      type: "file",
                    }}
                    sx={{ width: "60%" }}
                    onChange={handleImport}
                  />
                </CustomLabel>
                {isUploading ? (
                  <Loading />
                ) : (
                  <SearchButton
                    type="submit"
                    variant="contained"
                    disableRipple
                    onClick={handleUpload}
                  >
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      columnGap={"40px"}
                      alignItems={"center"}
                      sx={{ width: "180px" }}
                    >
                      <AddCircleOutlineIcon />
                      <Typography variant="h6" component="h5">
                        {"Upload"}
                      </Typography>
                    </Stack>
                  </SearchButton>
                )}
              </FormUpdate>
            </Paper>
          </Stack>
          <Stack
            direction="column"
            justifyContent="flex-start"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Typography variant="h5" component="h2" fontWeight={700}>
              {"Listar Uploads"}
            </Typography>
            <TableTitles>
              <Stack
                direction="row"
                sx={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Typography>{"Data Upload"}</Typography>
                <Typography>{"Status"}</Typography>
                <Typography>{"Nome do arquivo"}</Typography>
                {/**<Typography>{"Ação"}</Typography>**/}
              </Stack>
            </TableTitles>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "fit-content",
              }}
            >
              {filesListDTO &&
                filesListDTO.files.length > 0 &&
                filesListDTO.files.map((file: IFileProps) => (
                  <Stack
                    key={file.id_file}
                    direction="row"
                    sx={{
                      width: "100%",
                      backgroundColor: `${
                        file.id_file % 2 == 0 ? "#FFFFFF" : "#F1F1F1"
                      }`,
                      p: 1,
                      borderRadius: "2px",
                    }}
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="subtitle1"
                      color={"#1C4961"}
                      fontWeight={700}
                    >
                      {file.created_at}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color={"#1C4961"}
                      fontWeight={700}
                      sx={{
                        width: "40%",
                        textAlign: "center",
                      }}
                    >
                      {file.status}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color={"#1C4961"}
                      fontWeight={700}
                      sx={{
                        width: "20%",
                        textAlign: "right",
                      }}
                    >
                      {file.original_name}
                    </Typography>
                    {/**<DeleteIcon
                        color="error"
                        sx={{ ":hover": { cursor: "pointer" } }}
                    />**/}
                  </Stack>
                ))}
            </Paper>
          </Stack>
          <Stack
            direction="row"
            sx={{ width: "100%" }}
            alignItems="center"
            justifyContent="center"
            display="flex"
            columnGap="12px"
          >
            <ButtonPaginate
              type="submit"
              disableRipple
              onClick={() => setPageNumber((pageNumber) => pageNumber - 1)}
              disabled={pageNumber === 1}
            >
              <ArrowBackIosNewIcon />
            </ButtonPaginate>
            <ButtonPaginate
              type="submit"
              disableRipple
              onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
              disabled={pageNumber === filesListDTO?.total_pages}
            >
              <ArrowForwardIosIcon />
            </ButtonPaginate>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

Upload.auth = true;
