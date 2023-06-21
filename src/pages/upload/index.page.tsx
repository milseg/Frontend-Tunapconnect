import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Container,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
import { UpdateFiles } from "@/types/upload-file";
import { useInfiniteQuery, useMutation } from "react-query";
import uploadFileRequests from "../api/uploadFile.api";
import { api } from "@/lib/api";

export default function Upload() {
  const [uploadContent, setUploadContent] = useState<UpdateFiles[]>([
    {
      data: "19/06/2023 08:00",
      status: "Incluído",
      name: "arquivoteste.xlsx",
      id: 1,
    },
  ]);

  const [fileName, setFileName] = useState<string>(
    "Nenhum arquivo selecionado"
  );

  const {
    data: filesListDTO,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["uploadFileQuery"],
    queryFn: uploadFileRequests.getUploadsList,
    getNextPageParam: (lastPage: string | any[], allPages: string | any[]) => {
      if (!(lastPage?.length < 6)) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  function handleLoadFiles() {
    fetchNextPage();
  }

  const handleRemove = (selectId: number) => {
    const newUploadContent = uploadContent.filter(
      (fileUp) => fileUp.id !== selectId
    );
    console.log(newUploadContent);
    setUploadContent(newUploadContent);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(e);
    if (fileName !== "Nenhum arquivo selecionado") {
      setUploadContent([
        ...uploadContent,
        {
          data: "19/06/2023 08:00",
          status: "Incluído",
          name: fileName,
          id: uploadContent.length + 1,
        },
      ]);
    }
  };

  const handleImport = (event: any) => {
    const files = event.target.files;
    if (
      files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      files.length
    ) {
      const file = files[0];
      setFileName(file.name);
      console.log(typeof file);
    }
    console.log(filesListDTO);
  };

  const updateFilesUploadMutation = useMutation(
    (newDataUploadFile: UpdateFiles) => {
      return api.post(`/upload_arquivos`, newDataUploadFile).then((resp) => {
        return resp.data.data[0];
      });
    },

    {
      onSuccess: () => {
        console.log("sucess");
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  async function handleAddFile(stageData: UpdateFiles) {
    const dataForPost = {
      data: stageData?.data,
      status: stageData?.status,
      name: stageData?.name,
      id: stageData?.id,
    };

    // @ts-ignore
    updateFilesUploadMutation.mutate(dataForPost);
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
                {"TUNAP Connect > Empresa > Oficina >Lista de agendamentos"}
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
              <FormUpdate onSubmit={handleSubmit}>
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
                <SearchButton type="submit" variant="contained" disableRipple>
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
                <Typography>{"Ação"}</Typography>
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
              {uploadContent.map((upload) => (
                <Stack
                  key={upload.id}
                  direction="row"
                  sx={{
                    width: "100%",
                    backgroundColor: `${
                      upload.id % 2 == 0 ? "#FFFFFF" : "#F1F1F1"
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
                    {upload.data}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color={"#1C4961"}
                    fontWeight={700}
                  >
                    {upload.status}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color={"#1C4961"}
                    fontWeight={700}
                  >
                    {upload.name}
                  </Typography>
                  <DeleteIcon
                    color="error"
                    onClick={() => handleRemove(upload.id)}
                    sx={{ ":hover": { cursor: "pointer" } }}
                  />
                </Stack>
              ))}
            </Paper>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

Upload.auth = true;
