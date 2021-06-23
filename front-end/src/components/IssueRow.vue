<template>
	<div id="issue-entry" class="d-flex flex-row align-items-center">
		<div id="issue-label" :style="labelColor" class="issue-element"></div>
		<i
			id="issue-icon"
			class="bi bi-bug issue-element"
			v-if="issue.type == 'bug'"
		></i>
		<i
			id="issue-icon"
			class="bi-book issue-element"
			v-else-if="issue.type == 'story'"
		></i>
		<i
			id="issue-icon"
			class="bi bi-bullseye issue-element"
			v-else-if="issue.type == 'task'"
		></i>
		<span id="issue-id" class="issue-element">{{ '#' + issue.id }}</span>
		<img
			id="issue-assignee-icon"
			v-if="issue.assignees.length > 0"
			:src="issue.assignees[0]"
			width="24px"
			height="24px"
			class="rounded-circle align-self-center issue-element"
		/>
		<div
			id="issue-assignees-num"
			v-if="issue.assignees.length > 1"
			class="
				issue-element
				d-flex
				flex-row
				align-items-center
				justify-content-center
			"
		>
			{{ '+' + (issue.assignees.length - 1) }}
		</div>
		<span class="issue-element">{{ issue.name }}</span>
		<div
			id="issue-date"
			class="
				d-flex
				flex-row
				align-items-center
				justify-content-center
				ml-auto
			"
		>
			{{ issue.date }}
		</div>
		<div
			id="issue-points"
			class="d-flex flex-row align-items-center justify-content-center"
		>
			{{ issue.points }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		issue: Object,
	},
	computed: {
		labelColor() {
			return {
				'--bg-color': this.issue.color,
			};
		},
	},
};
</script>

<style scoped>
#issue-entry {
	height: 40px;
	background-color: white;
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
