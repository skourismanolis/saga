<template>
	<b-modal
		:id="modalId"
		size="lg"
		header-class="py-4"
		modal-class="issue-modal-border"
		static
		@ok="save"
	>
		<div v-if="issue != null && loaded">
			<div class="header">
				<div class="details-label">
					{{ issue != null ? issue.code : '' }}
				</div>
				<div class="header-bottom">
					<div
						@dblclick="toggleEditable()"
						@focusout="toggleEditable()"
						class="d-flex flex-row align-items-baseline"
					>
						<div
							v-if="editable == false"
							style="margin-top: 30%; margin-right: 6px"
						>
							<i
								id="issue-icon"
								class="bi bi-bug issue-element"
								v-if="category == 'Bug'"
							></i>
							<i
								id="issue-icon"
								class="bi-book issue-element"
								v-else-if="category == 'Story'"
							></i>
							<i
								id="issue-icon"
								class="bi bi-bullseye issue-element"
								v-else-if="category == 'Task'"
							></i>
						</div>
						<b-form-select
							v-else
							type=""
							size="sm"
							class="mt-3"
							v-model="category"
							:options="Types"
							required
						>
						</b-form-select>
					</div>
					<h4 id="issue-title" class="primary">
						<h5
							v-if="editable == false"
							class="issue-title"
							@dblclick="toggleEditable()"
						>
							{{ title }}
						</h5>
						<b-form-input
							v-else
							class="title-input"
							type="text"
							v-model="title"
							required
							@focusout="toggleEditable()"
						></b-form-input>
					</h4>
				</div>
				<div class="left">
					<label class="details-label">ΠΕΡΙΓΡΑΦΗ</label>
					<p
						v-if="editable == false"
						class="details-text"
						@dblclick="toggleEditable()"
					>
						{{ description }}
					</p>
					<b-form-textarea
						v-else
						class="description-input"
						placeholder="Γράψτε μια περιγραφή..."
						v-model="description"
						required
						@focusout="toggleEditable()"
					>
					</b-form-textarea>
					<label class="details-label">ΣΧΟΛΙΑ</label>
					<div class="d-flex align-items-center mt-2">
						<img :src="DEFAULT_PICTURE" class="user-image" />
						<b-form-textarea
							v-model="newComment"
							placeholder="Γράψτε ένα σχόλιο..."
						></b-form-textarea>
					</div>
					<div
						v-for="comment in comments.content"
						:key="comment.id"
						class="d-flex align-items-center mt-2"
					>
						<b-form-textarea
							v-model="comment.content"
							disabled
						></b-form-textarea>
					</div>
				</div>
			</div>
			<div class="right">
				<div class="priority-column-row">
					<div
						@dblclick="toggleEditable()"
						@focusout="toggleEditable()"
					>
						<label class="issue-elem-select">
							<Priority
								v-if="editable == false"
								class="issue-element"
								:priority="issue.priority"
								style="margin-top: 8px; margin-right: 6px"
							/>
							<b-form-select
								v-else
								type=""
								size="sm"
								class="mt-1"
								v-model="priority"
								:options="Priorities"
								required
							>
							</b-form-select>
						</label>
					</div>
					<div
						@dblclick="toggleEditable()"
						@focusout="toggleEditable()"
					>
						<label class="issue-elem-select">
							<label
								v-if="editable == false"
								class="text-white rounded-xl"
								:style="getColumnStyle()"
								style="padding: 9px; border-radius: 50px"
							>
								{{ column != null ? column.name : '' }}
							</label>
							<b-form-select
								v-else
								size="sm"
								class="mt-1"
								v-model="column"
								required
							>
								<b-form-select-option
									v-for="(column, idx) in columns"
									:key="idx"
									:value="column"
								>
									{{ column.name }}
								</b-form-select-option>
							</b-form-select>
						</label>
					</div>
				</div>
				<label class="details-label">ΥΠΕΥΘΥΝΟΙ</label>
				<TagList
					:current="assignees"
					:members="projectMembers"
					@add="assigneeAdd"
					@remove="assigneeRemove"
				/>
				<label class="details-label">LABEL</label>

				<div
					@dblclick="toggleEditable()"
					@focusout="toggleEditable()"
					class="issue-label"
				>
					<p
						class="details-text"
						id="p-tag"
						v-if="!editable && label != null"
						:style="'border-color: ' + label.color"
					>
						{{ label.name }}
					</p>
					<b-form-select
						v-else
						type=""
						size="sm"
						class="mt-1"
						v-model="label"
						required
					>
						<b-form-select-option
							v-for="(label, idx) in labels"
							:key="idx"
							:value="label"
						>
							{{ label.name }}
						</b-form-select-option>
					</b-form-select>
				</div>
				<label class="details-label">SPRINT</label>

				<div
					@dblclick="toggleEditable()"
					@focusout="toggleEditable()"
					class="issue-label"
				>
					<p class="details-text" v-if="!editable">
						{{ sprint != null ? sprint.title : '' }}
					</p>
					<b-form-select
						v-else
						type=""
						size="sm"
						class="mt-1"
						v-model="sprint"
						required
					>
						<b-form-select-option
							v-for="(sprint, idx) in sprints.content"
							:key="idx"
							:value="sprint"
						>
							{{ sprint.title }}
						</b-form-select-option>
					</b-form-select>
				</div>

				<label class="details-label">EPIC</label>
				<div
					@dblclick="toggleEditable()"
					@focusout="toggleEditable()"
					class="issue-label"
				>
					<p class="details-text" v-if="!editable">
						{{ epic != null ? epic.title : '' }}
					</p>
					<b-form-select
						v-else
						type=""
						size="sm"
						class="mt-1"
						v-model="epic"
						required
					>
						<b-form-select-option
							v-for="(epic, idx) in epics.content"
							:key="idx"
							:value="epic"
						>
							{{ epic.title }}
						</b-form-select-option>
					</b-form-select>
				</div>

				<label class="details-label">ΠΟΝΤΟΙ</label>
				<div
					@dblclick="toggleEditable()"
					@focusout="toggleEditable()"
					class="issue-label"
				>
					<p class="details-text" v-if="!editable">
						{{ points != null ? points : '' }}
					</p>
					<b-form-input
						v-else
						v-model="points"
						type="number"
						required
					></b-form-input>
				</div>
				<label class="details-label">ΗΜ/ΝΑ ΛΗΞΗΣ</label>
				<b-form-datepicker
					size="sm"
					v-model="deadline"
					:date-format-options="{
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					}"
				></b-form-datepicker>
			</div>
		</div>
	</b-modal>
</template>

<script>
const DEFAULT_PICTURE = require(`@/assets/profile pics/default-profile-pic.png`);

import Priority from './IssuePriority.vue';
import TagList from './TagList.vue';

export default {
	components: {
		Priority,
		TagList,
	},
	props: {
		issue: Object,
		modalId: {
			type: String,
			required: false,
		},
	},
	data() {
		return {
			loaded: false,

			sprints: ['Active 1', 'Active 2', 'Active 3'],
			epics: ['Epic 1', 'Epic 2', 'Epic 3'],
			Priorities: ['Very High', 'High', 'Neutral', 'Low', 'Very Low'],
			labels: ['Front-End', 'Back-end', 'Design'], //prop ?
			columns: ['TO-DO', 'IN PROGRESS', 'DONE'],
			Types: ['Task', 'Bug', 'Story'],
			assigneeSearchText: '',
			projectMembers: ['a', 'b', 'c'],
			editable: false,

			id: null,
			title: 'Νέος τίτλος',
			category: 'Task',
			priority: 'Neutral',
			description: 'Κάνε διπλό κλικ στις τιμές για να τις αλλάξεις!',
			points: 0,
			deadline: new Date(),

			newComment: null,

			project: null,
			sprint: null,
			epic: null,
			label: null,
			column: null,
			comments: [],
			assignees: [],
		};
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
	},
	watch: {
		async issue() {
			console.log('123');
			await this.initializeIssue();
		},
	},
	methods: {
		assigneeAdd(assignee) {
			this.issue.assignees.push(assignee);
		},

		assigneeRemove(assignee) {
			this.issue.assignees.splice(
				this.issue.assignees.indexOf(assignee),
				1
			);
		},
		toggleEditable: function () {
			this.editable = this.editable == false ? true : false;
		},
		getColumnStyle() {
			if (this.column == 'TO-DO') {
				return 'background-color:#FFC95B';
			}

			if (this.column == 'IN PROGRESS') {
				return 'background-color: #F3B1B8';
			}

			if (this.column == 'DONE') {
				return 'background-color:#7B7393';
			}
		},
		async loadSelectValues() {
			const projectId = this.$route.params.idProject;
			try {
				this.project = await this.$client.getProject({
					idProject: projectId,
				});
				[
					this.sprints,
					this.epics,
					this.labels,
					this.columns,
					this.projectMembers,
				] = await Promise.all([
					this.project.getSprints({}),
					this.project.getEpics(),
					this.project.getLabels(),
					this.project.getColumns(),
					this.project.getMembers(),
				]);
			} catch (error) {
				alert(error);
			}
		},

		async save() {
			try {
				await this.project.createIssue({
					title: this.title,
					category: this.category,
					points: this.points,
					priority: this.priority,
					description: this.description,
					deadline: this.deadline,
					label: this.label,
					assignees: this.assignees,
				});
			} catch (error) {
				alert(error);
			}
		},
		async initializeIssue() {
			this.loaded = false;
			await this.$nextTick();
			if (this.issue != null) {
				this.title = this.issue.title;
				this.category = this.issue.category;
				this.priority = this.issue.priority;
				this.description = this.issue.description;
				this.deadline = this.issue.deadline;

				this.comments = await this.issue.getComments();
				this.label = await this.issue.getLabel();
				this.assignees = await this.issue.getAssignees();
				this.column = await this.issue.getColumn();
				this.epic = await this.issue.getEpic();
				this.sprint = await this.issue.getSprint();

				this.loaded = true;
			}
		},
	},
	async created() {
		try {
			console.log('created');
			await this.loadSelectValues();
			await this.initializeIssue();

			this.loaded = true;
		} catch (error) {
			alert(error);
		}
	},
};
</script>

<style scoped>
.user-image {
	height: 30px;
	width: auto;
	border-radius: 50px;
	margin-right: 16px;
}

h4 {
	color: rgb(255, 172, 17);
	letter-spacing: 0.5px;
	margin: 12px;
	margin-bottom: 18px;

	font-weight: 440;
	justify-content: center;
	margin-left: 0;
}
div.row.my-1 {
	display: flex;
	align-items: center;
}

.create-issue-body {
	background-color: lavender;
	width: 75%;
	padding-right: 8%;
	padding-top: 2px;
}

.details-label {
	font-size: smaller;
	font-weight: bold;
	margin-bottom: 0;
	color: rgb(151, 151, 151);
}
.details-text {
	margin-top: 0.3rem;
	margin-bottom: 0.3rem;
}

.left {
	width: 75%;
	float: left;
}

.right {
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

.header {
	margin-top: -10%;
	margin-right: 25px;
}

.header-top {
	margin-top: -2%;
	padding-left: 25%;
}

.header-bottom {
	display: flex;
	margin-top: -2%;
	padding-top: 5px;
}

i {
	padding-bottom: 0.3%;
	margin-top: -3%;
	color: #db5461;
	font-size: 22px;
}

.priority-column-row {
	display: flex;
}
</style>
