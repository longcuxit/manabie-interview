import { Breadcrumbs, Link, Typography } from "@mui/material";
import { PureComponent, ContextType } from "react";
import { BreadcrumbProps, store, UpdateAction } from "./Store";

export class BreadCrumb extends PureComponent<BreadcrumbProps> {
  static contextType = store.Context;

  context!: ContextType<typeof store.Context>;

  item!: BreadcrumbProps;
  update!: UpdateAction;

  componentDidMount() {
    this.item = this.props;
    this.update = this.context.action(this.item);
  }

  componentDidUpdate() {
    this.item = this.props;
    this.update = this.update(this.item) as UpdateAction;
  }

  componentWillUnmount() {
    console.log("delete");
    this.update();
  }

  render = Boolean;
}

export const BreadcrumbContainer = store.createContainer();

const useBreadcrumb = store.createHook();

export const BreadCrumbRender = () => {
  const [breadcrumbs] = useBreadcrumb();
  const renders = breadcrumbs.slice();
  const root = renders.shift();

  if (!root) return null;

  const last = renders.pop();
  return (
    <Breadcrumbs>
      <Link
        underline="hover"
        color="inherit"
        href={root.path}
        onClick={root.onClick}
      >
        {root.label}
      </Link>
      {renders.map((item, i) => (
        <Link
          key={i}
          underline="hover"
          onClick={item.onClick}
          color="inherit"
          href={item.path}
        >
          {item.label}
        </Link>
      ))}
      {last && <Typography color="text.primary">{last.label}</Typography>}
    </Breadcrumbs>
  );
};
