import { render } from "@testing-library/react";
import Login from "../index";

jest.mock("../Form", () => () => <>LoginForm</>);

test("pages/Login: match snapshot", () => {
  const { container } = render(<Login />);
  expect(container).toMatchSnapshot();
});
