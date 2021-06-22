<template>
	<div class="d-flex justify-content-around">
		<button type="button" class="btn btn-light button-container">
			Backlog
			<div class="line align-self-end"></div>
		</button>
		<button type="button" class="btn btn-light button-container">
			Board
			<div class="line"></div>
		</button>
		<button type="button" class="btn btn-light button-container">
			Project Settings
			<div class="line"></div>
		</button>
	</div>
</template>

<style scoped>
.button-container {
	height: 73px;
	width: 100%;
	border-radius: 0;
	padding: 0 0;
}

.line {
	background-color: #aaaaaa;
	width: 110%;
	height: 3px;

	position: relative;
	bottom: 0;
}

.button-container:hover .line {
	background-color: #564787;
}
</style>
