import { render, act } from "@testing-library/react";
import { useLoading } from "../Store";
import { LoaderWrapper, withLoader } from "../Wrapper";

describe("components/Loader:", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "requestAnimationFrame")
      .mockImplementation((call) => (call(1), 1));

    jest
      .spyOn(global, "setTimeout")
      .mockImplementation((call: any) => (call(), 1));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should show loading with wrapper", async () => {
    let loading!: boolean;
    let pushLoader!: (promise: Promise<void>) => Promise<void>;

    const Com = () => {
      [loading, pushLoader] = useLoading();
      return null;
    };

    const { container } = render(
      <LoaderWrapper>
        <Com />
      </LoaderWrapper>
    );

    let done!: () => void;
    expect(loading).toBe(false);
    expect(container.querySelector(".Loader-spinner")).not.toBeInTheDocument();

    act(() => {
      pushLoader(new Promise((resolve) => (done = resolve)));
    });

    expect(loading).toBe(true);
    expect(container.querySelector(".Loader-spinner")).toBeInTheDocument();

    await act(async () => {
      done();
    });

    expect(loading).toBe(false);
    expect(container.querySelector(".Loader-spinner")).not.toBeInTheDocument();
  });

  it("should render component withLoader", async () => {
    const Com = withLoader(() => <>withLoader</>);

    const { getByText } = render(<Com />);

    expect(getByText("withLoader")).toBeInTheDocument();
  });
});
