<template>
	<div id="issue-entry" class="d-flex flex-row align-items-center">
		<div id="issue-label" :style="labelColor"></div>
	</div>
</template>

<script>
export default {
	props: {
		color: String,
	},
	computed: {
		labelColor() {
			return {
				'--bg-color': this.color,
			};
		},
	},
};
</script>

<style scoped>
#issue-entry {
	height: 40px;
	background-color: white;
}

#issue-label {
	height: 100%;
	width: 6px;
	margin-right: 6px;
	background-color: var(--bg-color);
}
</style>
