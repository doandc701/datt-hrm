import Tippy from "./tippy/Main.vue";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./modal";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "./tab";
import LoadingIcon from "./loading-icon/Main.vue";
import ChartBar from "./chart/bar-chart/Main.vue";
import ChatLine from "./chart/line-chart/Main.vue";
import {
  Dropdown,
  DropdownContent,
  DropdownDivider,
  DropdownFooter,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "./dropdown";
import LucideIcons from "./lucide";

export default (app) => {
  app.component("Tippy", Tippy);
  app.component("Dropdown", Dropdown);
  app.component("DropdownToggle", DropdownToggle);
  app.component("DropdownMenu", DropdownMenu);
  app.component("DropdownContent", DropdownContent);
  app.component("DropdownItem", DropdownItem);
  app.component("DropdownHeader", DropdownHeader);
  app.component("DropdownFooter", DropdownFooter);
  app.component("DropdownDivider", DropdownDivider);
  app.component("Modal", Modal);
  app.component("ModalHeader", ModalHeader);
  app.component("ModalBody", ModalBody);
  app.component("ModalFooter", ModalFooter);
  app.component("TabGroup", TabGroup);
  app.component("TabList", TabList);
  app.component("Tab", Tab);
  app.component("TabPanels", TabPanels);
  app.component("TabPanel", TabPanel);
  app.component("LoadingIcon", LoadingIcon);
  app.component("ChartBar", ChartBar);
  app.component("ChatLine", ChatLine);

  for (const [key, icon] of Object.entries(LucideIcons)) {
    app.component(key, icon);
  }
};
