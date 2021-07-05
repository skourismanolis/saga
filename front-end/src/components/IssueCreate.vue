<template>
	<b-container class="create-issue-body">
		<h4><strong>Create an issue</strong></h4>
		<div>
			<b-button v-b-modal.modal-lg>Launch demo modal</b-button>
			<div id="modal-id-outer">
				<b-modal
					id="modal-lg"
					size="lg"
					header-class="py-4"
					modal-class="issue-modal-border"
					style="border-left-color: blue"
					static
				>
					<div class="header">
						<div class="details-label">
							{{ issue.id }}
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
										v-if="issue.type == 'Bug'"
									></i>
									<i
										id="issue-icon"
										class="bi-book issue-element"
										v-else-if="issue.type == 'Story'"
									></i>
									<i
										id="issue-icon"
										class="bi bi-bullseye issue-element"
										v-else-if="issue.type == 'Task'"
									></i>
								</div>
								<b-form-select
									v-else
									type=""
									size="sm"
									class="mt-3"
									v-model="issue.type"
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
						</div>
						<div class="left">
							<label class="details-label">ΠΕΡΙΓΡΑΦΗ</label>
							<p
								v-if="editable == false"
								class="details-text"
								@dblclick="toggleEditable()"
							>
								{{ issue.description }}
							</p>
							<b-form-textarea
								v-else
								class="description-input"
								type="text"
								v-model="issue.description"
								required
								@focusout="toggleEditable()"
							>
							</b-form-textarea>
						</div>
					</div>
					<div class="right">
						<div
							@dblclick="toggleEditable()"
							@focusout="toggleEditable()"
						>
							<label class="issue-elem-select">
								<Priority
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
						</div>
						<label class="details-label">ΥΠΕΥΘΥΝΟΙ</label>
						<p class="details-text">TeamList(0)</p>
						<label class="details-label">LABEL</label>
						<p class="details-text" id="p-tag">
							{{ issue.label }}
						</p>
					</div>
				</b-modal>
			</div>
		</div>
	</b-container>
</template>

<script>
import Priority from './IssuePriority.vue';
export default {
	data() {
		return {
			Priorities: ['Very High', 'High', 'Neutral', 'Low', 'Very Low'],
			Types: ['Task', 'Bug', 'Story'],
			issue: {
				id: '#ED3452',
				type: 'Task',
				title: 'Doomdoom',
				description:
					'Lorem ipsum Kalimba KalimbaLorem ipsum Kalimba KalimbaLorem ipsum Kalimba Kalimba',
				priority: 'Low',
				label: 'Front-end',
				deadline: new Date(),
				points: 120,
			},
			editable: false,
		};
	},

	components: {
		Priority,
	},
	methods: {
		toggleEditable: function () {
			this.editable = this.editable == false ? true : false;
		},
	},
};
</script>

<style scoped>
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
	letter-spacing: 0.3em;
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
</style>
