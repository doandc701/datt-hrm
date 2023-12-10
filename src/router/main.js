import { generateStorageKey } from "@/utils/fomat";
import { APP_TOKEN_NAME, TYPE_ADMIN } from "@/config/constants";
import { useSideMenuStore } from "@/stores/side-menu";
import router from "@/router/index";
let checkRouterWithToken = (token, to, userInfo) => {
  if (!token) {
    const publicPaths = ["/login", "/forgot-password", "/reset-password"];
    if (publicPaths.includes(to.path)) {
      return true;
    }
    return { path: "/login" };
  }
  if (token) {
    if (!userInfo) {
      window.$cookies.remove(generateStorageKey(APP_TOKEN_NAME));
      if (to.path === "/login") {
        return true;
      }
      return { path: "/login" };
    }

    if (userInfo.first_login) {
      if (to.path === "/setting-password") {
        return true;
      }
      return { path: "/setting-password" };
    }

    if (!userInfo.first_login) {
      if (to.path === "/") {
        return true;
      }
      const publicPaths = [
        "/login",
        "/forgot-password",
        "/reset-password",
        "/setting-password",
      ];
      if (publicPaths.includes(to.path)) {
        return { path: "/" };
      }
    }
  }
};

let updateNameTab = (to) => {
  let title = to.name;
  let type = to.query.type;
  document.title =
    typeof title !== "undefined" ? title.toString() : "Quản lý nhân sự";
  if (type === "edit") {
    document.title =
      typeof to.query.pageName !== "undefined"
        ? to.query.pageName.toString()
        : "Quản lý nhân sự";
  }
};

let checkPermissionUser = (userInfo, to) => {
  const sideMenuStore = useSideMenuStore();

  const roleUser = userInfo?.roles.toString();
  if (roleUser === TYPE_ADMIN) {
    sideMenuStore.addMenuAdmin();
  }
  if (roleUser !== TYPE_ADMIN) {
    sideMenuStore.addMenuUser();
    const redirect404Paths = [
      "/master/branch/list",
      "/master/branch/add",
      "master/department/list",
      "master/department/add",
      "master/employee/list",
      "master/employee/add",
      "master/error-code/list",
      "master/error-code/add",
      "master/serial/list",
      "master/serial/add",
      "post/add",
    ];
    if (redirect404Paths.includes(to.path)) {
      router
        .push({
          path: "/error-page",
        })
        .then();
    }
  }
};

export { checkRouterWithToken, updateNameTab, checkPermissionUser };
