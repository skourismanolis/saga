<template>
	<div class="sprint-container">
		<div class="d-flex flex-row top justify-content-between">
			<div>
				<span id="sprint-title"> {{ sprint.name }} </span>
				<span id="issues-num">{{ issuesNum }}</span>
			</div>
			<div class="d-flex align-items-baseline flex-row">
				<span class="sprint-date"> {{ sprint.dateTime }} </span>
				<button
					v-if="sprint.active == true"
					type="button"
					class="
						btn btn-primary
						button
						d-flex
						align-items-center
						button-container
					"
				>
					Τερματισμός Sprint
					<i class="bi bi-check-circle button-icon"></i>
				</button>
				<button
					v-else-if="
						sprint.active == false && sprint.exists_active == true
					"
					type="button"
					class="
						btn btn-primary
						button
						d-flex
						align-items-center
						button-container
					"
					disabled
				>
					Εκκίνηση Sprint
					<i class="bi bi-play-circle button-icon"></i>
				</button>
				<button
					v-else-if="
						sprint.active == false && sprint.exists_active == false
					"
					type="button"
					class="
						btn btn-primary
						button
						d-flex
						align-items-center
						button-container
					"
				>
					Εκκίνηση Sprint
					<i class="bi bi-play-circle button-icon"></i>
				</button>
			</div>
		</div>
		<slot></slot>
		<div
			v-if="sprint.issues.length == 0"
			class="empty-msg d-flex justify-content-center"
		>
			<span> Δεν υπάρχουν issues! </span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		sprint: Object,
	},
	computed: {
		issuesNum() {
			if (this.sprint.issues != undefined && this.sprint.issues != null) {
				return this.sprint.issues.length;
			}
			return 0;
		},
		dateTime() {
			return 'Tue 23 Mar - Wed 36 Mar';
		},
	},
};
</script>

<style scoped>
.sprint-container {
	padding: 12px;
	background-color: #ffd580;
	border-radius: 4pt;
}

.top {
	margin-bottom: 12px;
}

#sprint-title {
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
	padding: 12px;
}

.button-icon {
	font-size: 24px;
	margin-left: 6px;
}

.sprint-date {
	color: white;
	font-size: 18px;
	font-weight: bold;
	margin-right: 12px;
}
</style>
