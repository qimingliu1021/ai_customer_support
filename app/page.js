"use client";
import Conversation from "./conversation/page";
import { Box, Stack, Typography, Alert } from "@mui/material";
import { red } from "@mui/material/colors";
import theme from "./theme/theme";
import { ThemeProvider } from "@emotion/react";

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Conversation />
      </Box>
    </ThemeProvider>
  );
}
