<template>
	<div v-if="project == null">
		<b-spinner />
	</div>
	<div v-else class="d-flex justify-content-center">
		<form
			class="d-flex flex-column justify-content-start container"
			@submit.prevent="createEpic"
		>
			<div class="d-flex flex-row align-items-center container-element">
				<i class="bi bi-hourglass epic-icon"></i>
				<b-input
					class="epic-title-input"
					v-model="title"
					placeholder="Εισάγετε τίτλο..."
					required
				/>
			</div>
			<div class="d-flex flex-row container-element">
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
						v-model="start"
					></b-form-datepicker>
				</div>
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΛΗΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
						v-model="deadline"
					></b-form-datepicker>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΠΕΡΙΓΡΑΦΗ</span>
				<textarea
					class="form-control"
					placeholder="Εισάγετε περιγραφή..."
					v-model="description"
				></textarea>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΣΥΝΟΛΟΛΙΚΟΙ ΠΟΝΤΟΙ</span>
				<span>{{ totalPoints }}</span>
			</div>
			<div class="drag-container" v-drag-and-drop:options="options">
				<EpicIssueBox
					class="drag-inner-list box container-element"
					:issues="epic_issues"
					ref="epicBox"
				>
					<IssueRow
						v-for="issue in epic_issues"
						:key="issue.id"
						:id="issue.id"
						:issue="issue"
						class="drag-item issue-row"
					/>
				</EpicIssueBox>

				<BacklogBox
					:totalIssues="filteredBacklog.length"
					:activeButton="false"
					class="drag-inner-list box container-element"
					ref="backlogBox"
				>
					<IssueRow
						v-for="(issue, idx) in filteredBacklog"
						:key="idx"
						:id="issue.id"
						:issue="issue"
						class="drag-item issue-row"
					/>
				</BacklogBox>
			</div>
			<button
				type="submit"
				class="btn btn-primary align-self-end submit-button"
			>
				Δημιουργία Epic
			</button>
		</form>
	</div>
</template>

<script>
import BacklogBox from '../components/BacklogBox.vue';
import EpicIssueBox from '../components/EpicIssueBox.vue';
import IssueRow from '../components/IssueRow.vue';

export default {
	components: {
		BacklogBox,
		EpicIssueBox,
		IssueRow,
	},
	data() {
		return {
			title: '',
			start: null,
			deadline: null,
			description: '',
			project: null,
			backlog: null,
			epic_issues: [],
		};
	},
	computed: {
		options() {
			return {
				dropzoneSelector: '.drag-inner-list',
				draggableSelector: '.drag-item',
				onDrop: this.drop,
			};
		},

		totalPoints() {
			if (this.epic_issues.length > 0) {
				let points = 0;

				for (let i in this.epic_issues) {
					if (i.points != null) points += i.points;
				}
				return points;
			}
			return 0;
		},
		dropZones() {
			return [].concat(this.backlogs, this.epic_issues);
		},
		filteredBacklog() {
			if (this.backlog == null) return [];
			let backlogItems = [...this.backlog.content];
			return backlogItems.filter((i) => {
				for (let ei of this.epic_issues) {
					if (ei.code === i.code) return false;
				}
				return true;
			});
		},
	},
	methods: {
		drop(e) {
			if (this.$refs.epicBox.$el === e.droptarget)
				this.epic_issues.push(
					this.filteredBacklog.find((i) => i.code === e.items[0].id)
				);
			else if (this.$refs.backlogBox.$el === e.droptarget) {
				let issue = this.epic_issues.find(
					(i) => i.code === e.items[0].id
				);
				let idx = this.epic_issues.indexOf(issue);
				this.epic_issues.splice(idx, 1);
			}
		},
		async createEpic() {
			try {
				let epic = await this.project.createEpic({
					title: this.title,
					start: this.start,
					deadline: this.deadline,
					description: this.description,
				});
				await epic.addIssues(this.epic_issues);
				this.$router.push(
					`/projects/${this.project.id}/epic/${epic.id}`
				);
			} catch (error) {
				alert(error);
			}
		},
	},
	async created() {
		try {
			this.project = await this.$client.getProject({
				idProject: this.$route.params.idProject,
			});
			this.backlog = await this.project.searchIssues({ inEpic: null });
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

.submit-button {
	width: 200px;
}
</style>
