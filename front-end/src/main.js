import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import './scss/custom.scss';
import ApiClient from '@dira/api-client';

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.prototype.$saga_client = new ApiClient({ url: 'http://localhost:3000' });

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
