<template>
	<div class="backlog-container">
		<div class="d-flex flex-row top justify-content-between">
			<div>
				<span id="backlog-title"> Backlog </span>
				<span id="issues-num">{{ issuesNum }}</span>
			</div>
			<button type="button" class="btn btn-primary button">
				Νέο Issue
				<i class="bi bi-plus create-epic-button-icon"></i>
			</button>
		</div>
		<IssueRow
			class="issue"
			v-for="(issue, index) in issues"
			:key="index"
			:issue="issue"
		/>
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
.backlog-container {
	padding: 12px;
	background-color: #f3b1b8;
	border-radius: 4pt;
}

.top {
	margin-bottom: 12px;
}

.button {
	border-radius: 4pt;
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

.issue {
	border-radius: 4pt;
	margin-bottom: 2px;
}
</style>
