import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import FormLogin from "modules/LoginForm";

export default function Login() {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      data-testid="page-login"
    >
      <div />
      <Grid container>
        <Grid item md={8} lg={7} xl={6} textAlign="center">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Sample logo"
            loading="lazy"
          />
        </Grid>
        <Grid item md={4} display="flex" alignItems="center">
          <FormLogin />
        </Grid>
      </Grid>
      <Box sx={{ bgcolor: "primary.main", p: 2, textAlign: "center" }}>
        <Typography color="lightskyblue">
          Copyright © 2020. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
