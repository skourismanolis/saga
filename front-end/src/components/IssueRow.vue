<template>
	<div class="d-flex flex-row align-items-center issue-entry">
		<div id="issue-label" :style="labelColor" class="issue-element"></div>
		<i
			id="issue-icon"
			class="bi bi-bug issue-element"
			v-if="issue.category == 'Bug'"
		></i>
		<i
			id="issue-icon"
			class="bi-book issue-element"
			v-else-if="issue.category == 'Story'"
		></i>
		<i
			id="issue-icon"
			class="bi bi-bullseye issue-element"
			v-else-if="issue.category == 'Task'"
		></i>
		<span id="issue-id" class="issue-element">{{ '#' + issue.code }}</span>
		<img
			id="issue-assignee-icon"
			v-if="assignees.length > 0"
			:src="picOrDefault(assignees[0])"
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
		<div
			v-if="issue.deadline != null"
			id="issue-date"
			class="
				d-flex
				flex-row
				align-items-center
				justify-content-center
				ml-auto
			"
		>
			{{ issue.deadline.toDateString() }}
		</div>
		<div v-else class="ml-auto" />

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

import IssuePriority from './IssuePriority.vue';
export default {
	components: {
		IssuePriority,
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
	methods: {
		picOrDefault(object) {
			if (object.picture != null) {
				return 'http://localhost:3000/profilePics/' + object.picture;
			} else {
				return DEFAULT_PICTURE;
			}
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

#issue-icon {
	color: #db5461;
	font-size: 24px;
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

#issue-date {
	background-color: white;
	font-size: 16px;
	color: #047c97;
	padding: 2px 10px;
	border-radius: 12pt;
	border-style: solid;
	border-color: black;
	border-width: 1px;
	margin-right: 6px;
}

#issue-points {
	background-color: #c4c4c4;
	padding: 3px;
	border-radius: 5pt;
	margin-right: 6px;
}
</style>
