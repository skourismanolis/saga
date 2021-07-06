<template>
	<div

		class="
			priority-container
			d-flex
			justify-content-center
			align-items-center
		"

		v-bind:class="{
			high: priority == 'Very High' || priority == 'High',
			neutral: priority == 'Neutral',
			low: priority == 'Very Low' || priority == 'Low',
		}"
	>
		<i v-if="priority == 'Very High'" class="bi bi-chevron-double-up"></i>
		<i v-if="priority == 'High'" class="bi bi-chevron-up"></i>
		<i v-if="priority == 'Neutral'" class="bi bi-dash"></i>
		<i v-if="priority == 'Low'" class="bi bi-chevron-down"></i>
		<i v-if="priority == 'Very Low'" class="bi bi-chevron-double-down"></i>
	</div>
</template>

<script>
export default {
	props: {
		priority: String,
	},
};
</script>

<style scoped>
.priority-container {
	font-size: 16px;


	width: 24px;
	height: 24px;

	-moz-border-radius: 50px;
	-webkit-border-radius: 50px;
	border-radius: 50px;
}


.high {
	background-color: #f8dde0;
	color: #db5461;
}



.neutral {
	background-color: #fedc97;
	color: #bb8c2d;
}


.low {
	background-color: #aafd8d;
	color: #31a309;
}
</style>
