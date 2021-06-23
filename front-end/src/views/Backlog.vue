<template>
	<div class="d-flex justify-content-between">
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
					@click="toggleExpanded(index)"
					class="d-flex flex-column"
				>
					<div
						id="epic-entry"
						class="d-flex flex-row align-items-center"
						v-bind:class="{ oddrow: index % 2 != 0 }"
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
		<div class="d-flex flex-column" id="right"></div>
	</div>
</template>

<script>
import IssueRow from '../components/IssueRow.vue';

export default {
	components: {
		IssueRow,
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
}
</style>
