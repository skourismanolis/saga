<template>
	<div v-if="!loaded">
		<b-spinner />
	</div>
	<div v-else class="d-flex justify-content-center">
		<form class="d-flex flex-column justify-content-start container">
			<div class="d-flex flex-row align-items-baseline container-element">
				<i class="bi bi-hourglass epic-icon"></i>
				<span
					v-if="editTitle == false"
					class="epic-title-input"
					@dblclick="toggleEditTitle()"
				>
					{{ title }}
				</span>
				<div class="d-flex flex-row align-items-baseline" v-else>
					<input
						type="text"
						class="form-control epic-title-input"
						placeholder="Εισάγετε τίτλο..."
						v-model="title"
						@focusout="toggleEditTitle()"
					/>
				</div>
			</div>
			<div class="d-flex flex-row container-element">
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ</span>
					<b-form-datepicker
						class="mb-2"
						v-model="start"
						@input="updateStart"
					></b-form-datepicker>
				</div>
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΛΗΞΗΣ</span>
					<b-form-datepicker
						class="mb-2"
						v-model="deadline"
						@input="updateDeadline"
					></b-form-datepicker>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΠΕΡΙΓΡΑΦΗ</span>
				<span
					v-if="editDesc == false"
					class="label-text"
					@dblclick="toggleEditDesc()"
					>{{ description }}</span
				>
				<div v-else>
					<textarea
						class="form-control"
						placeholder="Εισάγετε περιγραφή..."
						v-model="description"
						@focusout="toggleEditDesc()"
					></textarea>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΣΥΝΟΛΟΛΙΚΟΙ ΠΟΝΤΟΙ</span>
				<span>{{ totalPoints }}</span>
			</div>
			<div class="drag-container" v-drag-and-drop:options="options">
				<EpicIssueBox
					class="drag-inner-list box container-element"
					:issues="epicIssues.content"
					ref="epicBox"
				>
					<IssueRow
						v-for="issue in epicIssues.content"
						:key="issue.id"
						:id="issue.id"
						:issue="issue"
						class="drag-item issue-row"
					/>
				</EpicIssueBox>

				<BacklogBox
					:total-issues="backlog.content.length"
					:activeButton="false"
					class="drag-inner-list box container-element"
					ref="backlogBox"
				>
					<IssueRow
						v-for="issue in backlog.content"
						:key="issue.id"
						:id="issue.id"
						:issue="issue"
						class="drag-item issue-row"
					/>
				</BacklogBox>
			</div>
		</form>
	</div>
</template>

<script>
import EpicIssueBox from '../components/EpicIssueBox.vue';
import BacklogBox from '../components/BacklogBox.vue';
import IssueRow from '../components/IssueRow.vue';

export default {
	components: {
		EpicIssueBox,
		BacklogBox,
		IssueRow,
	},
	data() {
		return {
			title: '',
			start: null,
			deadline: null,
			description: '',

			loaded: false,
			editTitle: false,
			editDesc: false,
			project: null,
			backlog: null,
			epic: null,
			epicIssues: null,
		};
	},
	computed: {
		totalPoints() {
			if (this.epicIssues.content.length > 0) {
				let points = 0;

				for (let i in this.epicIssues.content) {
					if (i.points != null) points += i.points;
				}
				return points;
			}
			return 0;
		},
		options() {
			return {
				dropzoneSelector: '.drag-inner-list',
				draggableSelector: '.drag-item',
				onDrop: this.drop,
			};
		},
	},
	methods: {
		async drop(e) {
			if (this.$refs.epicBox.$el === e.droptarget) {
				let issue = this.backlog.content.find(
					(i) => i.code === e.items[0].id
				);
				await this.epic.addIssues([issue]);
			} else if (this.$refs.backlogBox.$el === e.droptarget) {
				let issue = this.epicIssues.content.find(
					(i) => i.code === e.items[0].id
				);
				await this.epic.removeIssues([issue]);
			}
			await this.epicIssues.refresh();
			await this.backlog.refresh();
			this.$forceUpdate();
		},
		async toggleEditTitle() {
			if (this.editTitle == true) {
				if (this.title.length === 0)
					return alert('Ενα Epic πρεπει να έχει τίτλο');
				await this.epic.update({ title: this.title });
				this.editTitle = false;
			} else {
				this.editTitle = true;
			}
		},
		async toggleEditDesc() {
			if (this.editDesc == true) {
				await this.epic.update({ description: this.description });
				this.editDesc = false;
			} else {
				this.editDesc = true;
			}
		},

		async updateStart() {
			await this.epic.update({ start: this.start });
		},

		async updateDeadline() {
			await this.epic.update({ deadline: this.deadline });
		},
	},
	async created() {
		try {
			this.project = await this.$client.getProject({
				idProject: this.$route.params.idProject,
			});
			this.epic = await this.project.getEpic(this.$route.params.idEpic);

			[this.backlog, this.epicIssues] = await Promise.all([
				this.project.searchIssues({ inEpic: null }),
				this.epic.getIssues(),
			]);

			this.title = this.epic.title;
			this.start = this.epic.start;
			this.deadline = this.epic.deadline;
			this.description = this.epic.description;
			await this.$nextTick();
			this.loaded = true;
		} catch (error) {
			alert(error);
		}
	},
};
</script>

<style scoped>
.container {
	margin: 48px 0;
	width: 1015px;
}

.container-element {
	margin-bottom: 24px;
}

.epic-icon {
	color: #db5461;
	font-size: 30px;

	margin-right: 12px;
}

.epic-title-input {
	width: 300px;
	height: 48px;
	font-size: 24px;
}

.label-text {
	font-size: 14px;
	margin-bottom: 8px;
}

.date-col-container {
	margin-right: 24px;
}

#date-picker {
	width: 147px;
}

.edit-button {
	width: 200px;
}
</style>
