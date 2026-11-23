/** Cấu hình cho `yarn page:create <route>`. */
const pageScaffoldConfig = {
  routeRoot: "app/(site)",
  templates: {
    default: "components/common/Template/GennaratePage/default",
    new: "components/common/Template/GennaratePage/new",
  },
  registryFile: ".page-scaffold.json",
  storeFile: "redux/configure-store.ts",
};

export default pageScaffoldConfig;
