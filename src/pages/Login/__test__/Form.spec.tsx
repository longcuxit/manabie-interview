import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthAction } from "store/Auth";
import FormLogin from "../Form";

jest.mock("store/Auth", () => ({
  useAuthAction: jest.fn(),
}));

const mockUseAuthAction = useAuthAction as jest.Mock;

describe("pages/Login/Form:", () => {
  test("match snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <FormLogin />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  test("submit form", () => {
    const login = jest.fn();
    mockUseAuthAction.mockImplementation(() => ({ login }));

    const { container } = render(
      <MemoryRouter>
        <FormLogin />
      </MemoryRouter>
    );
    fireEvent.click(container.querySelector("[type=submit]")!);

    expect(login).toBeCalledTimes(1);
  });
});
