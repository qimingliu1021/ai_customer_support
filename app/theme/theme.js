"user client";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    background: {
      default: "#93c7ef", // This sets the overall background color
      paper: "#ffffff", // This sets the background color for paper components (cards, modals, etc.)
    },
    primary: {
      main: "#5E6C9B",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#93c7ef", // Ensure body has the default background color
        },
      },
    },
  },
});

export default theme;
