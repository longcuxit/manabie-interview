import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Opps() {
  return (
    <Box
      component={Container}
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      height="100vh"
      role="alert"
    >
      <Typography variant="h1" gutterBottom>
        Opps!
      </Typography>
      <Typography></Typography>
    </Box>
  );
}
