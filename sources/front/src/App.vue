<template>
	<div id="app">
		<Navbar v-if="navbarFlag" />
		<router-view @toggle-navbar="toggleNavbar" />
		<div class="footer-container">
			<Footer />
		</div>
	</div>
</template>

<script>
import Footer from './components/Footer';
import Navbar from './components/navbar_off';

export default {
	components: {
		Footer,
		Navbar,
	},
	data() {
		return {
			navbarFlag: true,
		};
	},
	methods: {
		toggleNavbar(value) {
			this.navbarFlag = value;
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
