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

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			projectNavbar: false,
			public: true,
		},
	},
	{
		path: '/register',
		name: 'Register',
		component: Register,
		meta: {
			navbar: false,
			projectNavbar: false,
			public: true,
		},
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			navbar: false,
			projectNavbar: false,
			public: true,
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
		path: '/projects/:idProject/backlog',
		name: 'Backlog',
		component: Backlog,
	},
	{
		path: '/projects/:idProject/epic-create',
		name: 'EpicCreate',
		component: EpicCreate,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/projects/:idProject/epic/:idEpic',
		name: 'EpicView',
		component: EpicView,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/projects/:idProject/epic-edit/:idEpic',
		name: 'EpicEdit',
		component: EpicEdit,
		meta: {
			projectNavbar: false,
		},
	},
	{
		path: '/projects/:idProject/settings',
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
];

const router = new VueRouter({
	routes,
});

router.beforeEach((to, from, next) => {
	let loggedIn = false;

	try {
		let token = window.localStorage.getItem('token');
		loggedIn = token != null;
	} catch (error) {
		console.error(error);
	}

	if (!loggedIn && (to.meta == null || to.meta.public == false)) {
		console.log('navigation cancelled');
		next({
			path: '/login',
			query: { redir: from.path },
		});
		return;
	} else next();
});

export default router;
