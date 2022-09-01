import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthAction } from "store/Auth";
import FormLogin from "../";

jest.mock("store/Auth", () => ({
  useAuthAction: jest.fn(),
}));

const mockUseAuthAction = useAuthAction as jest.Mock;

describe("pages/Login/Form:", () => {
  test("submit form", () => {
    const login = jest.fn().mockResolvedValue(void 0);
    mockUseAuthAction.mockImplementation(() => ({ login }));

    const { getByRole } = render(
      <MemoryRouter>
        <FormLogin />
      </MemoryRouter>
    );
    fireEvent.submit(getByRole("form"));

    expect(login).toBeCalledTimes(1);
  });
});
