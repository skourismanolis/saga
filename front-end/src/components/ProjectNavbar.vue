<template>
	<div class="d-flex justify-content-around nav-container">
		<b-button
			type="button"
			class="
				button-container
				d-flex
				align-items-center
				justify-content-center
			"
			variant="light"
			:to="basePath + 'backlog'"
		>
			Backlog
			<div
				class="line"
				v-bind:class="{ active: $route.name == 'Backlog' }"
			></div>
		</b-button>
		<b-button
			type="button"
			class="
				button-container
				d-flex
				align-items-center
				justify-content-center
			"
			variant="light"
			:to="basePath + 'board'"
		>
			Board
			<div
				class="line"
				v-bind:class="{ active: $route.name == 'Board' }"
			></div>
		</b-button>
		<b-button
			type="button"
			class="
				button-container
				d-flex
				align-items-center
				justify-content-center
			"
			variant="light"
			:to="basePath + 'settings'"
		>
			Project Settings
			<div
				class="line"
				v-bind:class="{ active: $route.name == 'ProjectSettings' }"
			></div>
		</b-button>
	</div>
</template>

<script>
export default {
	computed: {
		basePath() {
			return `/projects/${this.$route.params.idProject}/`;
		},
	},
};
</script>

<style scoped>
.button-container {
	height: 73px;
	width: 100%;
	border-radius: 0;
	padding: 0 0;
	position: relative;
}

.line {
	background-color: #aaaaaa;
	width: 110%;
	height: 3px;

	position: absolute;
	bottom: 0;
}

.button-container:hover .line {
	background-color: #6654a1;
}

.active {
	background-color: #564787;
}
</style>
