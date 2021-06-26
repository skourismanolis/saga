import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import ProfileEdit from '../views/ProfileEdit.vue';
import Backlog from '../views/Backlog.vue';
import EpicCreate from '../views/EpicCreate.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/register',
		name: 'Register',
		component: Register,
		meta: {
			navbar: false,
			projectNavbar: false,
		},
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			navbar: false,
			projectNavbar: false,
		},
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/profile-edit',
		name: 'ProfileEdit',
		component: ProfileEdit,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/backlog',
		name: 'Backlog',
		component: Backlog,
	},
	{
		path: '/epic-create',
		name: 'EpicCreate',
		component: EpicCreate,
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ '../views/About.vue'),
	},
];

const router = new VueRouter({
	routes,
});

export default router;
