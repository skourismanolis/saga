<template>
	<div class="d-flex flex-row align-items-center issue-entry">
		<div id="issue-label" :style="labelColor" class="issue-element"></div>
		<IssueCategory class="issue-element" :category="issue.category" />
		<span id="issue-id" class="issue-element">{{ '#' + issue.code }}</span>
		<img
			id="issue-assignee-icon"
			v-if="assignees.length > 0"
			:src="assignees[0].picture || DEFAULT_PICTURE"
			width="24px"
			height="24px"
			class="rounded-circle align-self-center issue-element"
		/>
		<div
			id="issue-assignees-num"
			v-if="assignees.length > 1"
			class="
				issue-element
				d-flex
				flex-row
				align-items-center
				justify-content-center
			"
		>
			{{ '+' + (assignees.length - 1) }}
		</div>
		<span class="issue-element">{{ issue.title }}</span>
		<IssueDate>
			{{ issue.deadline.toDateString() }}
		</IssueDate>

		<div
			id="issue-points"
			class="d-flex flex-row align-items-center justify-content-center"
		>
			{{ issue.points }}
		</div>
		<IssuePriority class="issue-element" :priority="issue.priority" />
	</div>
</template>

<script>
const DEFAULT_PICTURE = require(`@/assets/profile pics/default-profile-pic.png`);

import IssueDate from './IssueDate.vue';
import IssuePriority from './IssuePriority.vue';
import IssueCategory from './IssueCategory.vue';

export default {
	components: {
		IssuePriority,
		IssueDate,
		IssueCategory,
	},
	props: {
		issue: Object,
	},
	data() {
		return { assignees: [] };
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
		labelColor() {
			return {
				'--bg-color': this.issue.color,
			};
		},
	},
	async created() {
		try {
			this.assignees = await this.issue.getAssignees();
		} catch (error) {
			alert(error);
		}
	},
};
</script>

<style scoped>
.issue-entry {
	height: 40px;
	background-color: white;
}

.issue-entry:hover {
	cursor: pointer;
	filter: brightness(90%);
}

.issue-element {
	margin-right: 6px;
}

#issue-label {
	height: 100%;
	width: 6px;

	background-color: var(--bg-color);
}

#issue-assignees-num {
	background-color: white;
	font-size: 16px;

	width: 24px;
	height: 24px;

	-moz-border-radius: 50px;
	-webkit-border-radius: 50px;
	border-radius: 50px;

	border-style: solid;
	border-color: black;
	border-width: 1px;
}

#issue-points {
	background-color: #c4c4c4;
	padding: 3px;
	border-radius: 5pt;
	margin-right: 6px;
}
</style>
