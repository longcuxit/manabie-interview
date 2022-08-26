import { usePushLoader } from "components/Loader";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthAction } from "store/Auth";

export default function FormLogin() {
  const actions = useAuthAction();
  const pushLoader = usePushLoader();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        pushLoader(actions.login("username", "password"));
      }}
    >
      <Form.Group as="label" className="form-group mb-4 d-block">
        <Form.Control
          type="email"
          size="lg"
          placeholder="Enter a valid email address"
        />
        <Form.Label as="span">Email address</Form.Label>
      </Form.Group>

      <Form.Group as="label" className="form-group mb-4 d-block">
        <Form.Control type="password" size="lg" placeholder="Enter password" />
        <Form.Label as="span">Password</Form.Label>
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center">
        <Form.Check label="Remember me" />

        <a href="#!" className="text-body">
          Forgot password?
        </a>
      </div>

      <div className="text-center text-lg-start mt-4 pt-2">
        <Button size="lg" className="px-2 w-100" type="submit">
          Login
        </Button>

        <p className="small fw-bold my-2 pt-1">
          Don't have an account?{" "}
          <Link to="#!" className="link-danger">
            Register
          </Link>
        </p>
      </div>
    </Form>
  );
}
