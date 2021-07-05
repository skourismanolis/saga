<template>
	<div v-if="!loaded" class="d-flex justify-content-center">
		<b-spinner />
	</div>
	<div v-else class="d-flex justify-content-start">
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
				@click="redirectEpicCreate()"
			>
				Νέο Epic
				<i class="bi bi-plus create-epic-button-icon"></i>
			</button>
			<div class="d-flex flex-column" v-if="epics.content.length === 0">
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
					v-for="(epic, index) in epics.content"
					:key="index"
					class="d-flex flex-column"
				>
					<div
						id="epic-entry"
						class="d-flex flex-row align-items-center"
						v-bind:class="{ oddrow: index % 2 != 0 }"
					>
						<button
							type="button"
							class="btn btn-primary epic-sprint-button"
							@click="addIssuesToActiveSprint(epic)"
						>
							<i class="bi bi-plus-lg"></i>
						</button>
						<i id="epic-icon" class="bi bi-hourglass"></i>
						<span id="epic-name">{{ epic.title }}</span>

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
							{{ epic.deadline.toDateString() }}
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
							{{ epicPoints(index) }}
						</div>
						<span id="epic-issues-num">
							{{ epic_issues[index].content.length }}
						</span>
						<i
							v-if="epic_expanded[index] == false"
							id="epic-chevron"
							class="bi bi-chevron-right"
							@click="toggleExpanded(index)"
						></i>
						<i
							v-else
							id="epic-chevron"
							class="bi bi-chevron-down"
							@click="toggleExpanded(index)"
						></i>
					</div>
					<div v-if="epic_expanded[index] == true">
						<IssueRow
							v-for="(issue, index) in epic_issues[index].content"
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
					<a
						type="button"
						class="link filter-element"
						@click="filterByEpic()"
						>Epic</a
					>
					<a type="button" class="link" @click="filterByLabel()"
						>Label</a
					>
				</div>

				<button
					id="create-sprint-button"
					type="button"
					class="btn btn-primary d-flex align-items-center mx-auto"
					@click="createSprint()"
				>
					Δημιουργία Sprint
					<i class="bi bi-plus create-epic-button-icon"></i>
				</button>
			</div>
			<div class="drag-container" v-drag-and-drop:options="options">
				<div
					class="align-self-center d-flex flex-column"
					v-if="sprints.content.length === 0"
				>
					<img
						id="empty-sprint-art"
						src="../assets/empty-sprint-art.png"
					/>
					<span class="align-self-center">
						Δεν υπάρχουν sprints!
					</span>
				</div>
				<div
					v-else
					v-for="(sprint, index) in sprints.content"
					:key="index"
				>
					<SprintBox
						:sprint="sprint"
						:exists_active="active_sprint != null"
						:active="sprint_active[index]"
						:id="sprint.id"
						:issuesNum="sprint_issues[index].content.length"
						class="drag-inner-list sprint-box"
						@activate-sprint="activateSprint"
					>
						<IssueRow
							v-for="issue in sprint_issues[index].content"
							:key="issue.code"
							:id="issue.code"
							:issue="issue"
							class="drag-item issue-row"
						/>
					</SprintBox>
				</div>

				<div id="line"><hr /></div>

				<BacklogBox
					:totalIssues="issues.content.length"
					:activeButton="true"
					:id="null"
					class="drag-inner-list backlog-box"
				>
					<IssueRow
						v-for="issue in issues.content"
						:key="issue.code"
						:id="issue.code"
						:issue="issue"
						class="drag-item issue-row"
					/>
				</BacklogBox>
			</div>
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
			loaded: false,
			renderComponent: true,

			project: {},

			//epic data
			epics: {},
			epic_issues: [],
			epic_expanded: [],

			//sprint data
			active_sprint: {},
			active_sprint_issues: [],
			sprints: {},
			sprint_issues: [],
			sprint_active: [],

			//backlog data
			issues: {},
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

		dropZones() {
			return [].concat(this.renderedBacklog, this.renderedSprints);
		},
	},
	methods: {
		async activateSprint(value) {
			console.log(value);
			let sprint = this.sprints.content.find(
				(obj) => parseInt(obj.id) == parseInt(value)
			);
			await this.project.setActiveSprint(sprint);
			await this.sprints.refresh();
		},

		epicPoints(index) {
			let points = 0;
			this.epic_issues[index].content.forEach((issue) => {
				points += issue.points;
			});
			return points;
		},
		async drop(event) {
			try {
				let item_id = event.items[0].id;
				let owner_id = event.owner.id;
				let target_id = event.droptarget.id;

				var item;
				var owner;
				var target;
				var owner_index;
				var target_index;
				//if owner is not the backlog
				if (owner_id != '') {
					//find owner index in sprints
					owner_index = this.sprints.content.findIndex(
						(obj) => parseInt(obj.id) == parseInt(owner_id)
					);

					owner = this.sprints.content.find(
						(obj) => parseInt(obj.id) == parseInt(owner_id)
					);

					// find item
					item = this.sprint_issues[owner_index].content.find(
						(obj) => parseInt(obj.code) == parseInt(item_id)
					);
				} else {
					item = this.issues.content.find(
						(obj) => parseInt(obj.code) == parseInt(item_id)
					);
					owner = this.issues;
				}
				// check target
				if (target_id != '') {
					target_index = this.sprints.content.findIndex(
						(obj) => parseInt(obj.id) == parseInt(target_id)
					);

					target = this.sprints.content.find(
						(obj) => parseInt(obj.id) == parseInt(target_id)
					);

					await target.addIssues([item]);
					await this.sprint_issues[target_index].refresh();
				} else {
					await owner.removeIssues([item]);
					await this.issues.refresh();
				}

				if (owner_id != '') {
					await this.sprint_issues[owner_index].refresh();
				} else {
					await this.issues.refresh();
				}
				this.$forceUpdate();
			} catch (error) {
				alert(error);
			}
		},

		toggleExpanded(index) {
			if (this.epic_expanded[index] == true) {
				console.log('its true');
				this.epic_expanded[index] = false;
			} else if (this.epic_expanded[index] == false) {
				console.log('its false');
				this.epic_expanded[index] = true;
			}
			this.$forceUpdate();
		},
		addIssuesToActiveSprint(epic) {
			if (this.active_sprint != null) {
				console.log(epic);
			}
		},

		createSprint() {
			// USE API CLIENT HERE INSTEAD OF THIS
			this.sprints.push({
				id: 9,
				name: 'Νέο Sprint',
				start_date: new Date(),
				end_date: new Date(),
				active: false,
				exists_active: true,
				issues: [],
			});
		},

		filterByEpic() {
			for (let i = 0; i < this.dropZones.length; i++) {
				this.dropZones[i].issues.sort(
					(a, b) => parseInt(a.epicId) - parseInt(b.epicId)
				);
			}
		},
		filterByLabel() {
			for (let i = 0; i < this.dropZones.length; i++) {
				this.dropZones[i].issues.sort(
					(a, b) => (a.type > b.type) - (a.type < b.type)
				);
			}
		},

		redirectEpicCreate() {
			// let query = { activePlan: value };
			this.$router
				.push({ path: '/epic-create' /*, query: query*/ })
				.catch(() => {});
		},

		updateSprint() {
			console.log('update sprint');
		},

		updateBacklog() {
			console.log('update backlog');
		},
	},
	async created() {
		try {
			this.project = await this.$client.getProject({
				idProject: this.$route.params.idProject,
			});

			//getting epic data
			this.epics = await this.project.getEpics();
			this.epic_issues = [];

			for (let i = 0; i < this.epics.content.length; i++) {
				//issue fetching
				let tempIssues = await this.epics.content[i].getIssues();
				this.epic_issues.push(tempIssues);

				//expanded init
				this.epic_expanded.push(false);
			}

			//getting backlog data
			this.issues = await this.project.searchIssues({
				inSprint: null,
			});

			//getting sprint data
			this.active_sprint = await this.project.getActiveSprint();
			this.sprints = await this.project.getSprints();

			for (let i = 0; i < this.sprints.content.length; i++) {
				//issue fetching
				let tempIssues = await this.sprints.content[i].getIssues();
				this.sprint_issues.push(tempIssues);

				//active init
				this.sprint_active.push(false);
			}

			this.loaded = true;
		} catch (error) {
			alert(error);
		}
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
	filter: brightness(90%);
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

.issue-row {
	border-radius: 4pt;
	margin-bottom: 2px;
}

.epic-sprint-button {
	margin-left: 8px;
	margin-right: 8px;
	border-radius: 50pt;
	width: 24px;
	height: 24px;
	padding: 0;
	background-color: #c4c4c4;
	border: 0;
}
</style>
