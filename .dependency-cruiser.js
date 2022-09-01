module.exports = {
  options: {
    exclude: ["__test__", "^(node_modules|coverage|public)"],
  },

  forbidden: [
    {
      name: "limit-components-to-outside",
      comment: "only allow dependencies from 'components' to 'utils",
      severity: "error",
      from: { path: "^src/components" },
      to: { pathNot: "^(src/)?(utils|components)" },
    },
    {
      name: "limit-models-to-outside",
      comment: "only allow dependencies from 'models' to 'utils",
      severity: "error",
      from: { path: "^src/models" },
      to: { pathNot: "^(src/)?(utils|models)" },
    },
    {
      name: "limit-modules-to-outside",
      comment:
        "only allow dependencies from 'modules' to 'components|models|service|store|utils'",
      severity: "error",
      from: { path: "^src/modules" },
      to: {
        pathNot: "^(src/)?(components|modules|models|service|store|utils)",
      },
    },
    {
      name: "limit-service-to-outside",
      comment: "only allow dependencies from 'service' to 'utils|models'",
      severity: "error",
      from: { path: "^src/service" },
      to: {
        pathNot: "^(src/)?(service|utils|models)",
      },
    },
    {
      name: "limit-store-to-outside",
      comment: "only allow dependencies from 'store' to 'utils|models|service'",
      severity: "error",
      from: { path: "^src/store" },
      to: {
        pathNot: "^(src/)?(store|utils|models|service)",
      },
    },
    {
      name: "limit-utils-to-outside",
      comment: "only allow dependencies from 'utils' to outside",
      severity: "error",
      from: { path: "^src/utils" },
      to: {
        pathNot: "^(src/)?utils",
      },
    },
    {
      name: "not-page-to-page",
      comment: "don't allow dependencies from 'page' to another 'page'",
      severity: "error",
      from: { path: "^src/pages/(.+/)" },
      to: { path: "^(src/)?pages/(?!$1)" },
    },
  ],
};
