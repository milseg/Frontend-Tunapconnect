import SearchIcon from "@mui/icons-material/Search";
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import Paper from "@mui/material/Paper";
import { SearchButton } from "./styles";

export default function Upload() {
  const currencies = [
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
    {
      value: "BTC",
      label: "฿",
    },
    {
      value: "JPY",
      label: "¥",
    },
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
              <Typography variant="h5" component="h2">
                {"Orçamentos"}
              </Typography>
              <Typography>
                {"TUNAP Connect > Empresa > Oficina >Lista de orçamentos"}
              </Typography>
            </Grid>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "row",
                height: "fit-content",
              }}
            >
              <Stack spacing={2} direction="row" sx={{ width: "100%" }}>
                <TextField
                  label="Pesquisar"
                  InputProps={{
                    type: "search",
                  }}
                />
                <SearchButton variant="contained" disableRipple>
                  <SearchIcon />
                </SearchButton>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Filtros</InputLabel>
                  <Select id="outlined-select-currency" label="Filtros">
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Paper>
          </Stack>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" component="h2">
              {"Lista de orçamentos"}
            </Typography>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

Upload.auth = true;
