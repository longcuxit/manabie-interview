import { render, screen } from "@testing-library/react";
import { PartialCheckbox } from "..";

describe("components/PartialCheckbox:", () => {
  it("snapshot checked", async () => {
    const { container } = render(
      <PartialCheckbox checked onChange={Boolean} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should show partial status", async () => {
    const { container } = render(<PartialCheckbox onChange={Boolean} />);
    expect(container.querySelector(".check-partial")).toBeInTheDocument();
  });
});
