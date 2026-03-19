import { createApp } from "vue";
import { router } from "@/router";
import App from "@/App.vue";
import { BootstrapVue3, BToastPlugin } from "bootstrap-vue-3";
import Vue3Autocounter from "vue3-autocounter";
import VueApexCharts from "vue3-apexcharts";
import VueSelect from "vue3-select2-component";
import DatePicker from "vue3-datepicker";
import StarRating from "vue-star-rating";
import Antd from "ant-design-vue";
import VueFeather from "vue-feather";
import "ant-design-vue/dist/reset.css";
import FlagIcon from "vue-flag-icon";
import VueSweetalert2 from "vue-sweetalert2";
import VueFormWizard from "vue3-form-wizard";

import ThemifyIcon from "vue-themify-icons";
import SimpleLineIcons from "vue-simple-line";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

/********* Layout component**********/
import Header from "@/views/layouts/pos-header.vue";
import Sidebar from "@/views/layouts/pos-sidebar.vue";
import UserMenu from "@/views/layouts/user-menu.vue";
import SideSettings from "@/views/layouts/side-settings.vue";
import CollapsedSidebar from "@/views/layouts/collapsed-sidebar.vue";
import HorizontalSidebar from "@/views/layouts/horizontal-sidebar.vue";

/********* Breadcrumb component**********/
import Breadcrumb from "@/components/breadcrumb/layout-breadcrumb.vue";

/********* Page component**********/



/********* Modal component**********/


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "pe7-icon/dist/dist/pe-icon-7-stroke.css";
import "typicons.font/src/font/typicons.css";
import "weathericons/css/weather-icons.css";
import "ionicons-npm/css/ionicons.css";
import "@/assets/css/feather.css";
import "@/assets/css/style.css";

import swal from "sweetalert2";
window.Swal = swal;

const app = createApp(App);

/********* Layout component**********/
app.component("layout-header", Header);
app.component("layout-sidebar", Sidebar);
app.component("user-menu", UserMenu);
app.component("side-settings", SideSettings);
app.component("collapsed-sidebar", CollapsedSidebar);
app.component("horizontal-sidebar", HorizontalSidebar);

/********* Breadcrumb component**********/
app.component("layout-breadcrumb", Breadcrumb);

/********* Page component**********/


/********* Modal component**********/


app.component("vue3-autocounter", Vue3Autocounter);
app.component(VueFeather.name, VueFeather);
app.component("vue-select", VueSelect);
app.component("date-picker", DatePicker);
app.component("star-rating", StarRating);
app.component("EasyDataTable", Vue3EasyDataTable);
app.use(FlagIcon).use(VueFormWizard);
app.use(VueSweetalert2);
app.use(VueApexCharts);
app
  .use(Antd)
  .use(BootstrapVue3)
  .use(BToastPlugin);

app.use(router).mount("#app");
