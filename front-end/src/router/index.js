import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import ProfileEdit from '../views/ProfileEdit.vue';
import Backlog from '../views/Backlog.vue';
import EpicCreate from '../views/EpicCreate.vue';
import EpicView from '../views/EpicView.vue';
import EpicEdit from '../views/EpicEdit.vue';
import ProjectSettings from '../views/ProjectSettings.vue';
import Projects from '../views/Projects.vue';
import DragableTest from '../views/DragableTest.vue';

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
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/epic-view',
		name: 'EpicView',
		component: EpicView,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/epic-edit',
		name: 'EpicEdit',
		component: EpicEdit,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/project-settings',
		name: 'ProjectSettings',
		component: ProjectSettings,
	},
	{
		path: '/projects',
		name: 'Projects',
		component: Projects,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/dragable',
		name: 'DragableTest',
		component: DragableTest,
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
