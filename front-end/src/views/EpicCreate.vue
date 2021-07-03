<template>
	<div class="d-flex justify-content-center">
		<form class="d-flex flex-column justify-content-start container">
			<div class="d-flex flex-row align-items-center container-element">
				<i class="bi bi-hourglass epic-icon"></i>
				<input
					type="text"
					class="form-control epic-title-input"
					placeholder="Εισάγετε τίτλο..."
				/>
			</div>
			<div class="d-flex flex-row container-element">
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
					></b-form-datepicker>
				</div>
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΛΗΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
					></b-form-datepicker>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΠΕΡΙΓΡΑΦΗ</span>
				<textarea
					class="form-control"
					placeholder="Εισάγετε περιγραφή..."
				></textarea>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΣΥΝΟΛΟΛΙΚΟΙ ΠΟΝΤΟΙ</span>
				<span>{{ totalPoints }}</span>
			</div>
			<div class="drag-container" v-drag-and-drop:options="options">
				<vue-draggable-group
					v-for="epic_issue in epic_issues"
					v-model="epic_issue.issues"
					:groups="dropZones"
					itemsKey="issues"
					:key="epic_issue.id"
					:data-id="epic_issue.id"
				>
					<EpicIssueBox
						class="drag-inner-list box container-element"
						:issues="epic_issues[0].issues"
					>
						<IssueRow
							v-for="issue in epic_issue.issues"
							:key="issue.id"
							:data-id="issue.id"
							:issue="issue"
							class="drag-item issue-row"
						/>
					</EpicIssueBox>
				</vue-draggable-group>

				<vue-draggable-group
					v-for="backlog in backlogs"
					v-model="backlog.issues"
					:groups="dropZones"
					itemsKey="issues"
					:key="backlog.id"
					:data-id="backlog.id"
				>
					<BacklogBox
						:backlog="backlog"
						:activeButton="false"
						class="drag-inner-list box container-element"
					>
						<IssueRow
							v-for="issue in backlog.issues"
							:key="issue.id"
							:data-id="issue.id"
							:issue="issue"
							class="drag-item issue-row"
						/>
					</BacklogBox>
				</vue-draggable-group>
			</div>
			<button
				type="submit"
				class="btn btn-primary align-self-end submit-button"
				@click="true"
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
			backlogs: [
				{
					id: -1,
					issues: [
						{
							id: 5,
							epicId: null,
							sprintId: -1,
							color: '#EE0000',
							type: 'task',
							assignees: [
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
							],
							name: 'Example Issue',
							date: '23 Μαρ',
							points: 2,
							priority: 'Neutral',
						},
						{
							id: 6,
							epicId: null,
							sprintId: -1,
							color: '#047C97',
							type: 'story',
							assignees: [
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
							],
							name: 'Example Issue',
							date: '23 Μαρ',
							points: 2,
							priority: 'Low',
						},
					],
				},
			],
			epic_issues: [
				{
					id: -2,
					issues: [],
				},
			],
		};
	},
	computed: {
		options() {
			return {
				dropzoneSelector: '.drag-inner-list',
				draggableSelector: '.drag-item',
				// onDrop: this.drop,
			};
		},
		totalPoints() {
			if (this.epic_issues[0].issues.length > 0) {
				let points = 0;

				for (let i in this.epic_issues[0].issues) {
					points += this.epic_issues[0].issues[i].points;
				}
				return points;
			}
			return 0;
		},
		dropZones() {
			return [].concat(this.backlogs, this.epic_issues);
		},
	},
	methods: {},
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
