<template>
	<b-container id="create-issue-body">
		<h4><strong>Create an issue</strong></h4>
		<form @submit.prevent="CreateIssue">
			<b-col sm="3">
				<label for="input-title">TITLE</label>
			</b-col>
			<b-col sm="4">
				<input
					contenteditable="true"
					v-model="issue.title"
					style="outline: none"
				/>
			</b-col>

			<b-row class="my-1">
				<b-col sm="3">
					<label for="textarea-limit"
						>Description<br />({{
							getDescriptionLength
						}}/200)</label
					>
				</b-col>
				<b-col sm="9">
					<b-form-textarea
						id="textarea-limit"
						placeholder="Describe in 200 or less characters."
						v-model="issue.description"
						trim
					></b-form-textarea>
				</b-col>
			</b-row>

			<h4>Choose category and tags</h4>
			<b-row class="my-1">
				<label for="category-selector" id="label0">Category </label>

				<b-select
					id="category-selector"
					v-model="issue.category"
					:options="Categories"
					class="my-1"
					required
				></b-select>
			</b-row>

			<h4>Set priority level</h4>
			<b-row class="my-1">
				<label
					for="priority-selector"
					id="priority-label"
					v-show="false"
					>Priority</label
				>
			</b-row>
		</form>
	</b-container>
</template>

<script>
//import { Priority } from './IssuePriority.vue';
export default {
	data() {
		return {
			Categories: ['Task', 'Epic', 'Story'],
			issue: {
				category: '',
				title: 'doomdoom',
				description: '',
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
	/*components: {
		Priority,
	},*/
};
</script>

<style scoped>
input:focus,
textarea:focus,
select:focus {
	outline: none;
}
</style>
