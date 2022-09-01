import {
  createElement,
  ComponentType,
  FunctionComponent,
  Fragment,
  ReactNode,
} from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";

import { LoaderContainer, LoaderState, useProgressLoader } from "./Store";

export interface LoaderWrapperProps {
  children: ReactNode;
  loader?: (state: LoaderState) => ReactNode;
}

const styles = {
  root: {
    position: "absolute",
    inset: 0,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundColor: "#00000033",
      zIndex: "999999",
    },
  },
  spinner: {
    zIndex: "999999",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const DefaultLoader = ({ total, count }: LoaderState) => {
  return (
    <Fade in={total !== count} unmountOnExit>
      <Box sx={styles.root}>
        <CircularProgress sx={styles.spinner} size={50} />
      </Box>
    </Fade>
  );
};

export function LoaderWrapper({
  children,
  loader = DefaultLoader,
}: LoaderWrapperProps) {
  const [state] = useProgressLoader();

  return (
    <Fragment>
      {children}
      {loader(state)}
    </Fragment>
  );
}

const initialState = { total: 0, count: 0 };

export function withLoader<P extends {}>(
  Com: ComponentType<P>
): FunctionComponent<P> {
  return (props: P) => {
    return (
      <LoaderContainer state={initialState}>
        {createElement(Com, props)}
      </LoaderContainer>
    );
  };
}
