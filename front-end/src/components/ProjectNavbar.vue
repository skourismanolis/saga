<template>
	<div class="d-flex justify-content-around">
		<button
			type="button"
			class="btn btn-light button-container"
			@click="$emit('tab-change', 'backlog')"
		>
			Backlog
			<div class="line" v-bind:class="{ active: tab == 'backlog' }"></div>
		</button>
		<button
			type="button"
			class="btn btn-light button-container"
			@click="$emit('tab-change', 'board')"
		>
			Board
			<div class="line" v-bind:class="{ active: tab == 'board' }"></div>
		</button>
		<button
			type="button"
			class="btn btn-light button-container"
			@click="$emit('tab-change', 'settings')"
		>
			Project Settings
			<div
				class="line"
				v-bind:class="{ active: tab == 'settings' }"
			></div>
		</button>
	</div>
</template>

<script>
export default {
	props: {
		tab: String,
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
