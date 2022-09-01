import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
import Pages from "./pages";

import { AsyncRenderContainer } from "components/AsyncRender";
import { LoaderWrapper, usePushLoader } from "components/Loader";

import Service from "service";
import { Completer } from "utils";
import Opps from "pages/Opps";

function App() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const pushLoader = usePushLoader();

  useEffect(() => {
    const connect = Completer.listen(Service.connect());
    pushLoader(connect.then(setConnected));
    return connect.reject;
  }, [pushLoader]);

  if (connected === null) return null;
  if (connected === false) return <Opps />;

  return (
    <AsyncRenderContainer>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Pages />
      </BrowserRouter>
      <ToastContainer />
    </AsyncRenderContainer>
  );
}

export default function AppLoader() {
  return (
    <LoaderWrapper>
      <App />
    </LoaderWrapper>
  );
}
