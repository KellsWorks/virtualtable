import { createApp } from "vue";
import App from "./App.vue";
//@ts-ignore
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
//@ts-ignore
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style.css";
import clickOutsideDirective from "./directives/click-outside";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { store } from "./store";


const app = createApp(App);
app.use(VueVirtualScroller);
app.use(ElementPlus);
app.use(store)
app.component("flat-pickr", flatPickr);
app.directive("click-outside", clickOutsideDirective);
app.mount("#app");
