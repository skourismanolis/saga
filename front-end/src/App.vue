<template>
	<div id="app">
		<Navbar v-if="navbarFlag" />
		<ProjectNavbar v-if="projectNavbarFlag" />
		<Issue />
		<router-view />
		<div class="footer-container">
			<Footer />
		</div>
	</div>
</template>

<script>
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProjectNavbar from './components/ProjectNavbar.vue';
import Issue from './components/IssueCreate.vue';

export default {
	components: {
		Footer,
		Navbar,
		ProjectNavbar,
		Issue,
	},
	computed: {
		navbarFlag() {
			if (this.$route.meta != null && this.$route.meta.navbar == false) {
				return false;
			} else {
				return true;
			}
		},

		projectNavbarFlag() {
			if (
				this.$route.meta != null &&
				this.$route.meta.projectNavbar == false
			) {
				return false;
			} else {
				return true;
			}
		},
	},
};
</script>

<style lang="scss">
// GLOBAL CSS

@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');

#app {
	font-family: 'Roboto', sans-serif;
}

.footer-container {
	background-color: #31245d;
}
</style>
