import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { AsyncModal } from "components/AsyncModal";

import Pages from "./pages";

import "./App.css";
import { LoaderWrapper, usePushLoader } from "components/Loader";
import { useEffect, useState } from "react";
import Service from "service";

function App() {
  const [connected, setConnected] = useState(false);
  const pushLoader = usePushLoader();

  useEffect(() => {
    pushLoader(Service.connect()).then(setConnected);
  }, [pushLoader]);

  if (!connected) return null;

  return (
    <AsyncModal>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Pages />
      </BrowserRouter>
    </AsyncModal>
  );
}

export default function AppLoader() {
  return (
    <LoaderWrapper as="main" className="App">
      <App />
    </LoaderWrapper>
  );
}
