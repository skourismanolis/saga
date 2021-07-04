<template>
	<b-container id="create-issue-body">
		<h4 id="issue-title" class="primary">
			<h5
				v-if="editTitle == false"
				class="issue-title"
				@dblclick="toggleEditTitle()"
			>
				{{ sprint.title }}
			</h5>
			<b-form-input
				v-else
				class="title-input"
				type="text"
				v-model="sprint.title"
				required
				@focusout="toggleEditTitle()"
			></b-form-input>
			<IssuePriority class="issue-element" :priority="issue.priority" />
			<strong>{{ issue.title }}</strong>
		</h4>
	</b-container>
</template>

<script>
import IssuePriority from './IssuePriority.vue';
export default {
	data() {
		return {
			Categories: ['Task', 'Epic', 'Story'],
			issue: {
				category: '',
				title: 'doomdoom',
				description: '',
				priority: 'High',
			},
		};
	},
	computed: {
		checkTitleLength() {
			return this.issue.title.length > 0 && this.issue.title.length < 31;
		},
		getTitleLength() {
			return this.issue.title.length;
		},
		getDescriptionLength() {
			return this.issue.description.length;
		},
	},
	components: {
		IssuePriority,
	},
};
</script>

<style scoped></style>
