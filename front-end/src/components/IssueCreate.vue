<template>
	<b-container id="create-issue-body">
		<h4><strong>Create an issue</strong></h4>
		<form @submit.prevent="CreateIssue">
			<b-row class="my-1">
				<b-col sm="3">
					<label for="input-title"
						>Title<br />({{ getTitleLength }}/30)</label
					>
				</b-col>
				<b-col sm="9">
					<b-form-input
						id="input-title"
						v-model="issue.title"
						placeholder="Enter title"
						required
						trim
					>
					</b-form-input>
				</b-col>
			</b-row>
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
import { Priority } from './IssuePriority.vue';
export default {
	data() {
		return {
			Categories: ['Task', 'Epic', 'Story'],
			issue: {
				category: '',
				title: '',
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
	components: {
		Priority,
	},
};
</script>

<style scoped>
label {
	margin-right: 0px;
	font-weight: 540;
	color: rgb(151, 151, 151);
	text-align: right;
}

div.col-sm-3 {
	width: 10%;
	text-align: end;
	padding-top: 0.25%;
}
select#category-selector {
	flex: 1%;
	margin-left: 3%;
	margin-right: 1%;
	padding: 0.375rem 0.75rem;
	font-size: 1rem;
	line-height: 1.5;
	background-color: #fff;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

h4 {
	color: rgb(255, 172, 17);
	letter-spacing: 0.5px;
	margin: 12px;
	margin-bottom: 18px;
	font-weight: 540;
	display: flex;
	justify-content: center;
}
div.row.my-1 {
	display: flex;
	align-items: center;
}
#label0 {
	margin-left: 200px;
}
#create-issue-body {
	background-color: lavender;
	width: 75%;
	padding-right: 8%;
	padding-top: 2px;
}
</style>
