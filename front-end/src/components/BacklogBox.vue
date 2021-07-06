<template>
	<div class="backlog-container">
		<div class="d-flex flex-row top justify-content-between">
			<div>
				<span id="backlog-title"> Backlog </span>
				<span id="issues-num">{{ totalIssues }}</span>
			</div>
			<button
				v-if="activeButton == true"
				type="button"
				class="
					btn btn-primary
					button
					d-flex
					align-items-center
					button-container
				"
				@click="$emit('issue-create')"
			>
				Νέο Issue
				<i class="bi bi-plus button-icon"></i>
			</button>
		</div>
		<slot> </slot>
		<div
			v-if="totalIssues == 0"
			class="empty-msg d-flex justify-content-center"
		>
			<span> Δεν υπάρχουν issues! </span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		totalIssues: Number,
		activeButton: Boolean,
	},
};
</script>

<style scoped>
.backlog-container {
	padding: 12px;
	background-color: #f3b1b8;
	border-radius: 4pt;
}

.top {
	margin-bottom: 12px;
}

#backlog-title {
	font-size: 24px;
	font-weight: bold;
	color: white;
}

#issues-num {
	color: #808080;
	font-size: 24px;
	margin-left: 12px;
}

.empty-msg {
	background-color: white;
	padding: 12px;
}

.button-container {
	height: 36px;
}

.button-icon {
	font-size: 24px;
}
</style>
