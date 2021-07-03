import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import './scss/custom.scss';
import SagaClient from '@dira/api-client';
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.prototype.$client = new SagaClient({ url: 'http://localhost:3000' });

new Vue({
	router,
	store,
	render: (h) => h(App),
	methods: {
		async loadUser() {
			let user;
			try {
				user = await this.$client.getProfile();
			} catch (error) {
				alert(error);
				return;
			}
			this.$store.commit('setIsLoggedIn', true);
			this.$store.commit('setUser', user);
			window.localStorage.setItem('token', this.$client.token);
		},
	},
	created() {
		let tok = window.localStorage.getItem('token', this.$client.token);
		if (tok != null) {
			this.$client.setToken(tok);
			this.loadUser();
		}
	},
}).$mount('#app');
