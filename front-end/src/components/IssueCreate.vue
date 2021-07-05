<template>
	<b-container id="create-issue-body">
		<h4><strong>Create an issue</strong></h4>
		<div>
			<b-button v-b-modal.modal-lg>Launch demo modal</b-button>

			<b-modal
				id="modal-lg"
				size="lg"
				style="border-left: 18px solid red"
			>
				<div id="header">
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
					<h4>{{ issue.title }}</h4>
				</div>
				<div id="left" class="width:75%;">
					<label class="details-label">ΠΕΡΙΓΡΑΦΗ</label>
					<p class="details-text">{{ issue.description }}</p>
				</div>
				<div id="right">
					<Priority
						class="issue-element"
						:priority="issue.priority"
					/>
					<label class="details-label">ΥΠΕΥΘΥΝΟΙ</label>
					<p class="details-text">TeamList(0)</p>
					<label class="details-label">LABEL</label>
					<p class="details-text" id="p-tag">
						{{ issue.label }}
					</p>
				</div>
			</b-modal>
		</div>
		<form @submit.prevent="CreateIssue">
			<b-row class="my-1" no-gutters>
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

			<h4>Choose type and tags</h4>
			<b-row class="my-1">
				<label for="type-selector" id="label0">type </label>

				<b-select
					id="type-selector"
					v-model="issue.type"
					:options="Types"
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
import Priority from './IssuePriority.vue';
export default {
	data() {
		return {
			Types: ['task', 'epic', 'story'],
			issue: {
				type: 'task',
				title: 'Doomdoom',
				description:
					'Lorem ipsum Kalimba KalimbaLorem ipsum Kalimba KalimbaLorem ipsum Kalimba Kalimba',
				priority: 'Low',
				label: 'Front-end',
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
div.col-sm-3 {
	width: 10%;
	text-align: end;
	padding-top: 0.25%;
}
select#type-selector {
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
	font-weight: 440;
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

.details-label {
	font-size: smaller;
	font-weight: bold;
	letter-spacing: 0.3em;
	margin-bottom: 0;
	color: rgb(151, 151, 151);
}

.details-text {
	margin-top: 0.3rem;
	margin-bottom: 0.3rem;
}

#left {
	width: 75%;
	float: left;
}

#right {
	width: 25%;
	float: right;
}

.modal-body {
	padding-top: 0;
}

#p-tag {
	border-left: 6px solid red;
	padding-left: 1%;
}

div#modal-lg___BV_modal_content_.modal-content {
	border-left: 6px solid red;
	padding-left: 1%;
}

#header {
	display: flex;
	margin-top: -9.5%;
	margin-right: 36px;
}

i {
	padding-top: 0.3%;
	padding-left: 1%;
	margin-top: 2%;
	color: #db5461;
	width: 22px;
	height: 24px;
}
</style>
