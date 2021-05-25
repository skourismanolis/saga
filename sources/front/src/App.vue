<template>
   <div id="app">
        <Footer/>
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

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css");

#app {
	font-family: 'Roboto', sans-serif;
    background-color: #31245D;
}
</style>
