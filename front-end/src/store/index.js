import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isLoggedIn: false,
		user: null,
	},
	mutations: {
		setIsLoggedIn(store, value) {
			store.isLoggedIn = value;
		},
		setUser(store, value) {
			store.user = value;
		},
	},
	actions: {},
	modules: {},
});
