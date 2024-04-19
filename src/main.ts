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
import ValidationProvider from 'vee-validate';
import ValidationObserver from 'vee-validate';
import { store } from "./store";


const app = createApp(App);
app.use(VueVirtualScroller);
app.use(ElementPlus);
app.use(store)
app.component("flat-pickr", flatPickr);
app.directive("click-outside", clickOutsideDirective);
app.component('validation-provider', ValidationProvider)
app.component('validation-observer', ValidationObserver)
app.mount("#app");
