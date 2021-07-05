<template>
	<i class="bi bi-bug issue-icon" v-if="category == 'Bug'"></i>
	<i class="bi-book issue-icon" v-else-if="category == 'Story'"></i>
	<i class="bi bi-bullseye issue-icon" v-else-if="category == 'Task'"></i>
</template>

<script>
export default {
	name: 'IssueCategory',
	props: {
		category: {
			required: true,
			type: String,
		},
	},
};
</script>

<style scoped>
.issue-icon {
	color: #db5461;
	font-size: 24px;
}
</style>
