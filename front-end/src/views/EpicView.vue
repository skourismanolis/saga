<template>
	<div class="d-flex justify-content-center">
		<form class="d-flex flex-column justify-content-start container">
			<div class="d-flex flex-row align-items-baseline container-element">
				<i class="bi bi-hourglass epic-icon"></i>
				<span
					v-if="editTitle == false"
					class="epic-title-input"
					@dblclick="toggleEditTitle()"
				>
					{{ epics[0].name }}
				</span>
				<div class="d-flex flex-row align-items-baseline" v-else>
					<input
						type="text"
						class="form-control epic-title-input"
						placeholder="Εισάγετε τίτλο..."
						v-model="epics[0].name"
						@focusout="toggleEditTitle()"
					/>
				</div>
			</div>
			<div class="d-flex flex-row container-element">
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
						v-model="epics[0].start_date"
					></b-form-datepicker>
				</div>
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΛΗΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
						v-model="epics[0].end_date"
					></b-form-datepicker>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΠΕΡΙΓΡΑΦΗ</span>
				<span
					v-if="editDesc == false"
					class="label-text"
					@dblclick="toggleEditDesc()"
					>{{ epics[0].description }}</span
				>
				<div v-else>
					<textarea
						class="form-control"
						placeholder="Εισάγετε περιγραφή..."
						v-model="epics[0].description"
						@focusout="toggleEditDesc()"
					></textarea>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΣΥΝΟΛΟΛΙΚΟΙ ΠΟΝΤΟΙ</span>
				<span>{{ totalPoints }}</span>
			</div>
			<div class="drag-container" v-drag-and-drop:options="options">
				<vue-draggable-group
					v-for="epic in epics"
					v-model="epic.issues"
					:groups="dropZones"
					itemsKey="issues"
					:key="epic.id"
					:data-id="epic.id"
				>
					<EpicIssueBox
						class="drag-inner-list box container-element"
						:issues="epics[0].issues"
					>
						<IssueRow
							v-for="issue in epic.issues"
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
				class="btn btn-primary align-self-end edit-button"
			>
				Αποθήκευση
			</button>
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
			editTitle: false,
			editDesc: false,

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
			epics: [
				{
					id: 1,
					name: 'Example Epic',
					start_date: new Date(1995, 1, 17),
					end_date: new Date(1995, 11, 17),
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros magna, finibus sit amet tellus quis, consequat tempus ligula. Fusce ante diam, facilisis sed dui quis, tristique fermentum purus. Proin iaculis mauris vel maximus vestibulum. Curabitur ut sem vitae mauris interdum sagittis sit amet eu enim. Phasellus a condimentum est. Proin diam nisl, gravida id pulvinar vel, tempor eleifend nunc. Nulla porttitor nunc ut ultricies fermentum. ',
					issues: [],
				},
			],
		};
	},
	computed: {
		totalPoints() {
			if (this.epics[0].issues.length > 0) {
				let points = 0;

				for (let i in this.epics[0].issues) {
					points += this.epics[0].issues[i].points;
				}
				return points;
			}
			return 0;
		},
		dropZones() {
			return [].concat(this.backlogs, this.epics);
		},
		options() {
			return {
				dropzoneSelector: '.drag-inner-list',
				draggableSelector: '.drag-item',
				// onDrop: this.drop,
			};
		},
	},
	methods: {
		toggleEditTitle() {
			if (this.editTitle == false) {
				this.editTitle = true;
			} else {
				this.editTitle = false;
			}
		},
		toggleEditDesc() {
			if (this.editDesc == false) {
				this.editDesc = true;
			} else {
				this.editDesc = false;
			}
		},
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
