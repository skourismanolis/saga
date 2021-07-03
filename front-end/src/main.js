import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import './scss/custom.scss';
import SagaClient from '@dira/api-client';
import VueDraggable from 'vue-draggable';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueDraggable);
Vue.prototype.$client = new SagaClient({ url: 'http://locahost:3000' });

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
