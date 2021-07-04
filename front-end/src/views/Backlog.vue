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
			<div class="d-flex flex-column" v-if="renderedEpics.length === 0">
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
					v-for="(epic, index) in renderedEpics"
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
							@click="addIssuesToActiveSprint(index)"
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
							{{ epicPoints(epic) }}
						</div>
						<span id="epic-issues-num">
							{{ epic.issues.length }}
						</span>
						<i
							v-if="epic.expanded == false"
							id="epic-chevron"
							class="bi bi-chevron-right"
							@click="toggleExpanded(epic)"
						></i>
						<i
							v-else
							id="epic-chevron"
							class="bi bi-chevron-down"
							@click="toggleExpanded(epic)"
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
					v-if="renderedSprints.length === 0"
				>
					<img
						id="empty-sprint-art"
						src="../assets/empty-sprint-art.png"
					/>
					<span class="align-self-center">
						Δεν υπάρχουν sprints!
					</span>
				</div>
				<div v-else>
					<vue-draggable-group
						v-for="sprint in renderedSprints"
						v-model="sprint.issues"
						:groups="dropZones"
						itemsKey="issues"
						:key="sprint.id"
						:data-id="sprint.id"
					>
						<SprintBox
							:sprint="sprint"
							class="drag-inner-list sprint-box"
						>
							<IssueRow
								v-for="issue in sprint.issues"
								:key="issue.code"
								:data-id="issue.code"
								:issue="issue"
								class="drag-item issue-row"
							/>
						</SprintBox>
					</vue-draggable-group>
				</div>

				<div id="line"><hr /></div>

				<vue-draggable-group
					v-for="backlog in renderedBacklog"
					v-model="backlog.issues"
					:groups="dropZones"
					itemsKey="issues"
					:key="backlog.id"
					:data-id="backlog.id"
				>
					<BacklogBox
						:backlog="backlog"
						:activeButton="true"
						class="drag-inner-list backlog-box"
					>
						<IssueRow
							v-for="issue in backlog.issues"
							:key="issue.code"
							:data-id="issue.code"
							:issue="issue"
							class="drag-item issue-row"
						/>
					</BacklogBox>
				</vue-draggable-group>
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

			//backlog data
			issues: {},

			//render data
			renderedBacklog: [],
			renderedEpics: [],
			renderedSprints: [],
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
		getRenderedEpics() {
			let epicsArray = this.epics.content;
			for (let i = 0; i < epicsArray.length; i++) {
				epicsArray[i].issues = [...this.epic_issues[i].content];
				epicsArray[i].expanded = true;
			}
			return epicsArray;
		},

		getRenderedBacklog() {
			let backlogArray = [
				{
					id: -1,
					issues: [...this.issues.content],
				},
			];
			return backlogArray;
		},

		getRenderedSprints() {
			let sprintsArray = this.sprints.content;
			for (let i = 0; i < sprintsArray.length; i++) {
				sprintsArray[i].issues = [...this.sprint_issues[i].content];
				sprintsArray[i].active = false;
				if (this.active_sprint == null) {
					sprintsArray[i].exists_active = false;
				} else {
					sprintsArray[i].exists_active = true;
				}
			}
			return sprintsArray;
		},

		epicPoints(epic) {
			let points = 0;
			epic.issues.forEach((issue) => {
				points += issue.points;
			});
			return points;
		},
		drop(event) {
			// console.log(event);
			let item_id = event.items[0].attributes['data-id'].value;
			let owner_id = event.owner.attributes['data-id'].value;
			let target_id = event.droptarget.attributes['data-id'].value;

			// console.log('item ' + item_id);
			// console.log('owner ' + owner_id);
			// console.log('target ' + target_id);

			let owner = this.dropZones.find((obj) => obj.id == owner_id);
			let target = this.dropZones.find((obj) => obj.id == target_id);
			let item = owner.issues.find(
				(obj) => parseInt(obj.code) == item_id
			);

			console.log(item);
			// console.log(owner);
			// console.log(target);

			owner.issues = owner.issues.filter(
				(elem) => parseInt(elem.code) != item_id
			);

			if (target_id == -1) item._idSprint = null;
			else item._idSprint = target_id;

			target.issues.push(item);
		},

		toggleExpanded(epic) {
			console.log(epic);
			if (epic.expanded == true) {
				console.log('its true');
				epic.expanded = false;
			} else if (epic.expanded == false) {
				console.log('its false');
				epic.expanded = true;
			}
			this.$forceUpdate();
		},
		addIssuesToActiveSprint(i) {
			let active_sprint_id = this.sprints[0].id;

			this.renderedEpics[i].issues.forEach((epic_issue) => {
				//check backlog
				for (let j = 0; j < this.backlogs[0].issues.length; j++) {
					if (
						this.backlogs[0].issues[j].id == epic_issue.id &&
						this.backlogs[0].issues[j].sprintId != active_sprint_id
					) {
						let data = this.backlogs[0].issues.splice(j, 1);
						data = data.pop();
						data.sprintId = this.sprints[0].id;
						this.sprints[0].issues.push(data);
					}
				}

				//check other sprints
				if (this.sprints.length > 1) {
					for (let j = 1; j < this.sprints.length; j++) {
						for (
							let k = 0;
							k < this.sprints[j].issues.length;
							k++
						) {
							if (
								this.sprints[j].issues[k].id == epic_issue.id &&
								this.sprints[j].issues[k].sprintId !=
									active_sprint_id
							) {
								let data = this.sprints[j].issues.splice(k, 1);
								data = data.pop();
								data.sprintId = this.sprints[0].id;
								this.sprints[0].issues.push(data);
							}
						}
					}
				}
			});
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
			}

			//get render data
			this.renderedBacklog = this.getRenderedBacklog();
			this.renderedEpics = this.getRenderedEpics();
			this.renderedSprints = this.getRenderedSprints();

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
