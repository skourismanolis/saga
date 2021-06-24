<template>
	<b-container>
		<h4><strong>Create an issue</strong></h4>
		<form @submit.prevent="CreateIssue">
			<h4>Name & Describe the issue</h4>
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
						:state="checkTitleLength"
						placeholder="Enter title"
						required
						@blur="$v.issue.title.$touch()"
						trim
					>
					</b-form-input>
				</b-col>
			</b-row>
			<b-row class="my-1">
				<b-col sm="3">
					<label for="textarea-limit">Description</label>
				</b-col>
				<b-col sm="9">
					<b-form-textarea
						id="textarea-limit"
						placeholder="Describe in 200 or less characters."
						v-model="issue.description"
						:state="issue.description.length <= 200"
						trim
					></b-form-textarea>
				</b-col>
			</b-row>
			<h4>Choose category and tags</h4>
			<b-row class="my-1">
				<label for="category-selector" style="width: 10%; height: 40px"
					>Category
				</label>

				<b-select
					id="category-selector"
					v-model="issue.category"
					:options="Categories"
					class="my-1"
					required
				></b-select>
			</b-row>
		</form>
	</b-container>
</template>

<script>
import { required, maxLength, minLength } from 'vuelidate/lib/validators';
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
	},
	validations: {
		title: {
			required,
			minLength: minLength(2),
			maxLength: maxLength(30),
		},
		description: {
			maxLength: maxLength(200),
		},
	},
};
</script>

<style scoped>
label {
	margin-right: 0px;
	font-weight: 540;
	color: rgb(151, 151, 151);
	text-align: end;
}

label.memo {
	float: left;
}
div.col-sm-3 {
	width: 10%;
	text-align: end;
	padding-top: 0.25%;
}

select#category-selector {
	flex: 1%;
	margin-left: 0.75rem;
	display: block;
	width: 100%;
	padding: 0.375rem 0.75rem;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	color: #212529;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid #ced4da;
	appearance: none;
	border-radius: 0.25rem;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	margin-right: 15.65%;
}

h4 {
	color: rgb(255, 172, 17);
	letter-spacing: 0.5px;
	margin: 12px;
	margin-bottom: 18px;
	font-weight: 540;
}

div.row.my-1 {
	display: flex;
	align-items: center;
}
</style>
