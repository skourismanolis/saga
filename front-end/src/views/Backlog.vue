<template>
	<div class="d-flex justify-content-start">
		<div class="d-flex flex-column" id="left">
			<span id="epics-label">Epics</span>
			<button
				type="button"
				class="
					btn btn-primary
					create-epic-button
					d-flex
					align-items-center
					justify-content-center
				"
			>
				Νέο Epic
				<i class="bi bi-plus create-epic-button-icon"></i>
			</button>
			<div class="d-flex flex-column" v-if="epics.length === 0">
				<img id="empty-epic-art" src="../assets/empty-epic-art.png" />
				<div class="d-flex flex-row justify-content-center">
					<span id="empty-epic-msg"> Δεν υπάρχουν Epics! </span>
					<a href="#" class="link" id="empty-epic-link"
						>Δημιούργησε ένα!</a
					>
				</div>
			</div>
			<div v-else id="epic-container">
				<div
					v-for="(epic, index) in epics"
					:key="index"
					class="d-flex flex-column"
				>
					<div
						id="epic-entry"
						class="d-flex flex-row align-items-center"
						v-bind:class="{ oddrow: index % 2 != 0 }"
						@click="toggleExpanded(index)"
					>
						<i id="epic-icon" class="bi bi-hourglass"></i>
						<span id="epic-name">{{ epic.name }}</span>
						<div
							id="epic-date"
							class="
								d-flex
								flex-row
								align-items-center
								justify-content-center
								ml-auto
							"
						>
							{{ epic.date }}
						</div>
						<div
							id="epic-points"
							class="
								d-flex
								flex-row
								align-items-center
								justify-content-center
							"
						>
							{{ epic.points }}
						</div>
						<span id="epic-issues-num">
							{{ epic.issues.length }}
						</span>
						<i
							v-if="epic.expanded == false"
							id="epic-chevron"
							class="bi bi-chevron-right"
						></i>
						<i
							v-else
							id="epic-chevron"
							class="bi bi-chevron-down"
						></i>
					</div>
					<div v-if="epic.expanded == true">
						<IssueRow
							v-for="(issue, index) in epic.issues"
							:key="index"
							:issue="issue"
						>
						</IssueRow>
					</div>
				</div>
			</div>
		</div>
		<div class="d-flex flex-column" id="right">
			<span id="sprints-label">Sprints</span>
			<div class="d-flex flex-row align-items-baseline">
				<div class="d-flex flex-row" id="filter-row-container">
					<span id="filter-text" class="filter-element"
						>Φίλτραρε issues με:</span
					>
					<a type="button" class="link filter-element">Epic</a>
					<a type="button" class="link">Label</a>
				</div>

				<button
					id="create-sprint-button"
					type="button"
					class="btn btn-primary d-flex align-items-center mx-auto"
				>
					Δημιουργία Sprint
					<i class="bi bi-plus create-epic-button-icon"></i>
				</button>
			</div>

			<div
				class="align-self-center d-flex flex-column"
				v-if="sprints.length === 0"
			>
				<img
					id="empty-sprint-art"
					src="../assets/empty-sprint-art.png"
				/>
				<span class="align-self-center"> Δεν υπάρχουν sprints! </span>
			</div>
			<div v-else>
				<SprintBox
					class="sprint-box"
					v-for="(sprint, index) in sprints"
					:key="index"
					:name="sprint.name"
					:start_date="sprint.star_date"
					:end_date="sprint.end_date"
					:active="sprint.active"
					:exists_active="sprint.exists_active"
					:issues="sprint.issues"
				/>
			</div>

			<div id="line"><hr /></div>
			<BacklogBox class="backlog-box" :issues="issues" />
		</div>
	</div>
</template>

<script>
import IssueRow from '../components/IssueRow.vue';
import BacklogBox from '../components/BacklogBox.vue';
import SprintBox from '../components/SprintBox.vue';

export default {
	components: {
		IssueRow,
		BacklogBox,
		SprintBox,
	},
	data() {
		return {
			// epicsList: [],
			epics: [
				{
					name: 'Example Epic',
					date: '23 Μαρ',
					points: 10,
					issues: [
						{
							color: '#EE0000',
							type: 'task',
							id: 1,
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
						{
							color: '#047C97',
							type: 'story',
							id: 1,
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
							color: '#299D00',
							type: 'bug',
							id: 1,
							assignees: [
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
							],
							name: 'Example Issue',
							date: '23 Μαρ',
							points: 2,
							priority: 'Very High',
						},
					],
					expanded: false,
				},

				{
					name: 'Example Epic',
					date: '23 Μαρ',
					points: 10,
					issues: [
						{
							color: '#EE0000',
							type: 'task',
							id: 1,
							assignees: [
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
							],
							name: 'Example Issue',
							date: '23 Μαρ',
							points: 2,
							priority: 'Very Low',
						},
						{
							color: '#047C97',
							type: 'story',
							id: 1,
							assignees: [
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
								require('../assets/profile pics/default-profile-pic.png'),
							],
							name: 'Example Issue',
							date: '23 Μαρ',
							points: 2,
							priority: 'High',
						},
					],
					expanded: false,
				},

				{
					name: 'Example Epic',
					date: '23 Μαρ',
					points: 10,
					issues: [],
					expanded: false,
				},
				{
					name: 'Example Epic',
					date: '23 Μαρ',
					points: 10,
					issues: [],
					expanded: false,
				},
			],

			sprints: [
				{
					name: 'Example Sprint',
					start_date: new Date('08/14/2020'),
					end_date: new Date('09/14/2020'),
					active: true,
					exists_active: true,
					issues: [
						{
							color: '#EE0000',
							type: 'task',
							id: 1,
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
							color: '#047C97',
							type: 'story',
							id: 1,
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

				{
					name: 'Example Sprint',
					start_date: new Date(1995, 1, 17),
					end_date: new Date(1995, 11, 17),
					active: false,
					exists_active: true,
					issues: [
						{
							color: '#EE0000',
							type: 'task',
							id: 1,
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
							color: '#047C97',
							type: 'story',
							id: 1,
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
			issues: [
				{
					color: '#EE0000',
					type: 'task',
					id: 1,
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
					color: '#047C97',
					type: 'story',
					id: 1,
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
		};
	},
	methods: {
		toggleExpanded(i) {
			if (this.epics[i].expanded == false) {
				this.epics[i].expanded = true;
			} else if (this.epics[i].expanded == true) {
				this.epics[i].expanded = false;
			}
		},
	},
};
</script>

<style scoped>
#left {
	margin-top: 36px;
	margin-left: 36px;
	background-color: #7b7393;
	width: 467px;
	padding: 24px;

	border-top-left-radius: 4pt;
	border-top-right-radius: 4pt;
}

#epics-label {
	color: white;
	font-size: 32px;
	font-weight: bold;

	margin-bottom: 24px;
}

.create-epic-button {
	border-radius: 4pt;

	margin-bottom: 24px;
	height: 36px;
}

.create-epic-button-icon {
	font-size: 24px;
}

#empty-epic-msg {
	color: white;
	margin-right: 5px;
}

#empty-epic-link {
	color: #ffd580;
}

#epic-entry {
	height: 50px;
	width: 100%;
	background-color: #f1f2f8;
}

#epic-entry:hover {
	cursor: pointer;
	-webkit-filter: brightness(90%);
}

.oddrow {
	background-color: white !important;
}

#epic-icon {
	color: #db5461;
	font-size: 24px;
	margin-right: 6px;
}

#epic-date {
	background-color: white;
	font-size: 16px;
	color: #047c97;
	padding: 2px 10px;
	border-radius: 12pt;
	border-style: solid;
	border-color: black;
	border-width: 1px;
	margin-right: 6px;
}

#epic-points {
	background-color: #c4c4c4;
	padding: 3px;
	border-radius: 5pt;
	margin-right: 6px;
}

#epic-issues-num {
	color: #808080;
	font-size: 24px;
	margin-right: 6px;
}

#epic-chevron {
	font-size: 24px;
	color: black;
}

#right {
	margin-top: 36px;
	margin-left: 36px;
	margin-right: 36px;
	width: 865px;
	position: relative;
}

#sprints-label {
	color: black;
	font-weight: bold;
	font-size: 32px;
	margin-bottom: 24px;
}

.filter-element {
	margin-right: 12px;
}

#filter-text {
	font-size: 16px;
}

#create-sprint-button {
	border-radius: 4pt;

	height: 36px;
	margin-bottom: 24px;
}

#filter-row-container {
	position: absolute;
	left: 0;
}

.backlog-box {
	margin-bottom: 36px;
}

.sprint-box {
	margin-bottom: 12px;
}
</style>
