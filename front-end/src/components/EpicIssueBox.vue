<template>
	<div class="epic-issue-container">
		<div class="d-flex flex-row top justify-content-between">
			<div>
				<span id="epic-issue-title"> Issues </span>
				<span id="issues-num">{{ issuesNum }}</span>
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
			<span>
				Σείρετε issues απο το backlog για να τα εισάγετε στο epic!
			</span>
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
		issues: Array,
	},
	computed: {
		issuesNum() {
			if (this.issues != undefined && this.issues != null) {
				return this.issues.length;
			}
			return 0;
		},
	},
};
</script>

<style scoped>
.epic-issue-container {
	padding: 12px;
	background-color: #c4c4c4;
	border-radius: 4pt;
}

.top {
	margin-bottom: 12px;
}

.button {
	border-radius: 4pt;
}

#epic-issue-title {
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
}

.button-icon {
	font-size: 24px;
}
</style>
