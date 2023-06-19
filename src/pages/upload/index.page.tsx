import { Title } from "@mui/icons-material";
import {
  Autocomplete,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { ContainerItem } from "./styles";
import Paper from "@mui/material/Paper";

export default function Upload() {
  const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
  ];
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
              <Typography variant="h5" component="h2">{"Orçamentos"}</Typography>
              <Typography>{"Lista de orçamentos"}</Typography>
            </Grid>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "row",
                height: "fit-content",
              }}
            >
              <Autocomplete
                sx={{ width: "100%" }}
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={top100Films.map((option) => option.title)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search input"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
            </Paper>
          </Stack>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" component="h2">{"Lista de orçamentos"}</Typography>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

Upload.auth = true;
