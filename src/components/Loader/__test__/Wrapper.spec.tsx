import { render, act } from "@testing-library/react";
import Fade from "@mui/material/Fade";
import { Completer } from "utils";

import "utils/polyfill";
import { renderHook } from "utils/testting";

import { useLoading } from "../Store";
import { LoaderWrapper, withLoader } from "../Wrapper";

jest.mock("@mui/material/Fade", () => jest.fn());

const mockFade = Fade as jest.Mock;

describe("components/Loader:", () => {
  beforeEach(() => {
    mockFade.mockImplementation((props) => <>{props.in && props.children}</>);
  });
  it("should show loading with wrapper", async () => {
    const { result, queryByRole } = renderHook(useLoading, {
      wrapper: ({ children }) => <LoaderWrapper>{children}</LoaderWrapper>,
    });

    expect(result.current[0]).toBe(false);
    expect(queryByRole("progressbar")).toBeNull();

    const completer = new Completer();
    act(() => {
      result.current[1](completer);
    });

    expect(result.current[0]).toBe(true);
    expect(queryByRole("progressbar")).toBeInTheDocument();

    await act(async () => completer.resolve());

    expect(result.current[0]).toBe(false);

    expect(queryByRole("progressbar")).toBeNull();
  });

  it("should render component withLoader", async () => {
    const Com = withLoader(() => <div>withLoader</div>);

    const { getByText } = render(<Com />);

    expect(getByText("withLoader")).toBeInTheDocument();
  });
});
