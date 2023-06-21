import styled from "@emotion/styled";
import { Paper } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export const SearchButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#0E948B",
  borderColor: "#0E948B",
});

export const TableTitles = styled(Paper)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "8px 22px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#1C4961",
  borderColor: "#1C4961",
  justifyItems: "flex-end",
  alignItems: "center",
  color: "white",
});

export const UploadFileField = styled(TextField)({
  width: "0.1px",
  height: "0.1px",
  opacity: 0,
  overflow: "hidden",
  position: "absolute",
  zIndex: -1,
});

export const CustomLabel = styled.label`
  width: 60%;
  height: 100%;
  font-size: 1rem;
  text-align: center;
  align-items: center;
  display: flex;
  border: 1px solid black;
  border-radius: 0.4rem;
  padding: 2px 3px;
`;

export const FormUpdate = styled.form`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`;
