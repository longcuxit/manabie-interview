import { Container, Image } from "react-bootstrap";

import { LoaderWrapper } from "components/Loader";
import FormLogin from "./Form";

export default function Login() {
  return (
    <LoaderWrapper
      as="section"
      className="vh-100 d-flex flex-column justify-content-between"
    >
      <Container fluid>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <Image
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              fluid
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <FormLogin />
          </div>
        </div>
      </Container>
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>
      </div>
    </LoaderWrapper>
  );
}
