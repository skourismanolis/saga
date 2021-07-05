<template>
	<b-container id="create-issue-body">
		<h4 id="issue-title" class="primary">
			<h5
				v-if="editable == false"
				class="issue-title"
				@dblclick="toggleEditable()"
			>
				{{ issue.title }}
			</h5>
			<b-form-input
				v-else
				class="title-input"
				type="text"
				v-model="issue.title"
				required
				@focusout="toggleEditable()"
			></b-form-input>
		</h4>
		<label
			class="issue-elem-select"
			@dblclick="toggleEditable()"
			@focusout="toggleEditable()"
		>
			<IssuePriority
				v-if="editable == false"
				class="issue-element"
				:priority="issue.priority"
			/>
			<b-form-select
				v-else
				type=""
				size="sm"
				class="mt-3"
				v-model="issue.priority"
				:options="Priorities"
				required
			>
			</b-form-select>
		</label>
	</b-container>
</template>

<script>
import IssuePriority from './IssuePriority.vue';

export default {
	data() {
		return {
			Categories: ['Task', 'Epic', 'Story'],
			Priorities: ['High', 'Very High', 'Very Low', 'Low', 'Neutral'],
			issue: {
				category: '',
				title: 'doomdoom',
				description: '',
				priority: 'High',
			},
			editable: false,
		};
	},
	components: {
		IssuePriority,
	},
	methods: {
		toggleEditable: function () {
			this.editable = this.editable == false ? true : false;
		},
	},
};
</script>

<style scoped></style>
