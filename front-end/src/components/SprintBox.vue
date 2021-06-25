<template>
	<div class="sprint-container">
		<div class="d-flex flex-row top justify-content-between">
			<div>
				<span id="sprint-title"> {{ name }} </span>
				<span id="issues-num">{{ issuesNum }}</span>
			</div>
			<div class="d-flex align-items-baseline flex-row">
				<span class="sprint-date"> {{ dateTime }} </span>
				<button
					v-if="active == true"
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
					v-else-if="active == false && exists_active == true"
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
					v-else-if="active == false && exists_active == false"
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
		<div v-if="issues.length > 0">
			<IssueRow
				class="issue"
				v-for="(issue, index) in issues"
				:key="index"
				:issue="issue"
			/>
		</div>
		<div v-else class="empty-msg d-flex justify-content-center">
			<span> Δεν υπάρχουν issues! </span>
		</div>
	</div>
</template>

<script>
import IssueRow from './IssueRow.vue';
export default {
	components: {
		IssueRow,
	},
	props: {
		name: String,
		start_date: Date,
		end_date: Date,
		active: Boolean,
		exists_active: Boolean,
		issues: Array,
	},
	computed: {
		issuesNum() {
			if (this.issues != undefined && this.issues != null) {
				return this.issues.length;
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

.button {
	border-radius: 4pt;
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

.issue {
	border-radius: 4pt;
	margin-bottom: 2px;
}

.empty-msg {
	background-color: white;
	padding: 12px;
}

.button-container {
	border-radius: 4pt;
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
