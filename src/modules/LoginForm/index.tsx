import { FormEvent } from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { usePushLoader } from "components/Loader";
import { useAuthAction } from "store/Auth";

export default function FormLogin() {
  const actions = useAuthAction();
  const pushLoader = usePushLoader();

  return (
    <Container>
      <Box
        component="form"
        role="form"
        display="flex"
        flexDirection="column"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          pushLoader(actions.login("username", "password"));
        }}
      >
        <TextField
          label="Email address"
          variant="outlined"
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Email address"
          variant="outlined"
          type="password"
          fullWidth
          sx={{ my: 2 }}
        />

        <Box>
          <FormControlLabel label="Remember me" control={<Checkbox />} />
          <Link to="#">Forgot password?</Link>
        </Box>

        <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
          Login
        </Button>

        <Typography>
          Don't have an account?
          <Link to="#!" className="link-danger">
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
