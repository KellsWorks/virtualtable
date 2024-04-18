import { createApp } from 'vue'
import App from './App.vue'
//@ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
//@ts-ignore
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(VueVirtualScroller)
app.use(ElementPlus)
app.mount('#app')
