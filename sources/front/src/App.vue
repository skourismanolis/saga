<template>
	<div id="app">
		<router-view />
		<div class="footer-container">
			<Footer />
		</div>
	</div>
</template>

<script>
import Footer from './components/Footer';

export default {
	components: {
		Footer,
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
