"use client";
import { Box, Container, CssBaseline, Paper } from "@mui/material";
import { LogInCard } from "../components/LogInCard";

export default function Home() {

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Box height="100vh" display="flex" flexDirection="column">
          <LogInCard />
        </Box>
      </Container>
    </>
  );
}
