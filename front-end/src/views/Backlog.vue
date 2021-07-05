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
				@click="redirectEpicCreate()"
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
					>
						<button
							type="button"
							class="btn btn-primary epic-sprint-button"
							@click="addIssuesToActiveSprint(index)"
						>
							<i class="bi bi-plus-lg"></i>
						</button>
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
							@click="toggleExpanded(index)"
						></i>
						<i
							v-else
							id="epic-chevron"
							class="bi bi-chevron-down"
							@click="toggleExpanded(index)"
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
			<div
				class="
					d-flex
					flex-row
					align-items-baseline
					justify-content-between
				"
			>
				<div class="d-flex flex-row align-items-baseline">
					<span id="filter-text" class="filter-element"
						>Φίλτραρε issues με:</span
					>

					<b-form-select
						class="filter-box filter-element"
						v-model="selected_epic"
						:options="epicTitles"
						@change="refreshIssues"
					></b-form-select>
					<b-form-select
						class="filter-box"
						v-model="selected_label"
						:options="labelTitles"
					></b-form-select>

				</div>

				<button
					id="create-sprint-button"
					type="button"

					class="btn btn-primary d-flex align-items-center"
					@click="createSprint()"

				>
					Δημιουργία Sprint
					<i class="bi bi-plus create-epic-button-icon"></i>
				</button>
			</div>
			<div class="drag-container" v-drag-and-drop:options="options">
				<div
					class="align-self-center d-flex flex-column"
					v-if="sprints.length === 0"
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
						v-for="sprint in sprints"
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
								:key="issue.id"
								:data-id="issue.id"
								:issue="issue"
								class="drag-item issue-row"
							/>
						</SprintBox>
					</vue-draggable-group>
				</div>

				<div id="line"><hr /></div>

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
						:activeButton="true"
						class="drag-inner-list backlog-box"
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
			sprints: {},
			sprint_issues: [],

			//backlog data
			issues: {},

			//filter data
			selected_epic: null,
			selected_label: null,
			labels: {},

		};
	},
	computed: {
		epicTitles() {
			let epic_titles = [
				{
					value: null,
					text: 'Επιλέξτε epic',
				},
			];
			this.epics.content.forEach((element) => {
				epic_titles.push({
					value: element,
					text: element.title,
				});
			});
			return epic_titles;
		},

		labelTitles() {
			let label_titles = [
				{
					value: null,
					text: 'Επιλέξτε label',
				},
			];
			this.labels.forEach((element) => {
				label_titles.push({
					value: element,
					text: element.name,
				});
			});
			return label_titles;
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
		drop(event) {
			let item_id = event.items[0].attributes['data-id'].value;
			let target_id = event.droptarget.attributes['data-id'].value;


		async editSprint(value) {
			let sprint = this.sprints.content.find(
				(obj) => parseInt(obj.id) == parseInt(value)
			);
			await sprint.update({
				title: sprint.title,
				deadline: sprint.deadline,
			});
			await this.sprints.refresh();
		},

		async dectivateSprint() {
			await this.project.setActiveSprint(null);
			this.active_sprint = null;
			await this.sprints.refresh();
		},

		async activateSprint(value) {
			console.log(value);
			let sprint = this.sprints.content.find(
				(obj) => parseInt(obj.id) == parseInt(value)
			);

			await this.project.setActiveSprint(sprint);
			this.active_sprint = sprint;
			await this.sprints.refresh();

			let sprint_index = this.sprints.content.findIndex(
				(obj) => parseInt(obj.id) == parseInt(value)
			);
			//move issues array
			[this.sprint_issues[0], this.sprint_issues[sprint_index]] = [
				this.sprint_issues[sprint_index],
				this.sprint_issues[0],
			];
			//move sprint
			[this.sprints.content[0], this.sprints.content[sprint_index]] = [
				this.sprints.content[sprint_index],
				this.sprints.content[0],
			];
			this.$forceUpdate();
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


			let item = target.issues.find((obj) => obj.id == item_id);
			item.sprintId = parseInt(target_id);
		},
		toggleExpanded(i) {
			if (this.epics[i].expanded == false) {
				this.epics[i].expanded = true;
			} else if (this.epics[i].expanded == true) {
				this.epics[i].expanded = false;
			}
		},
		addIssuesToActiveSprint(i) {
			let active_sprint_id = this.sprints[0].id;

			this.epics[i].issues.forEach((epic_issue) => {
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

				});
				this.$forceUpdate();
			}
		},

		redirectEpicView(id) {
			this.$router
				.push({
					//this is sleepless code it probably sucks
					path: `/projects/${this.$route.params.idProject}/epic/${id}`,
				})
				.catch(() => {});

		},
		redirectEpicCreate() {
			this.$router
				.push({
					path: `/projects/${this.$route.params.idProject}/epic-create`,
				})
				.catch(() => {});
		},

		async refreshIssues() {
			let params = {};
			if (this.selected_label != null) {
				params.labels = [this.selected_label];
			}
			if (this.selected_epic != null) {
				params.inEpic = this.selected_epic;
			}

			//update backlog
			this.issues = await this.project.searchIssues({
				inSprint: null,
				...params,
			});
			this.issues.refresh();

			//update sprints
			for (let i = 0; i < this.sprints.content.length; i++) {
				this.sprint_issues[i] = await this.project.searchIssues({
					inSprint: this.sprints.content[i],
					...params,
				});
				this.sprint_issues[i].refresh();
				this.$forceUpdate();
			}
		},
	},

	async created() {
		try {
			this.loaded = false;
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
			console.log('here');

			//getting sprint data
			this.active_sprint = await this.project.getActiveSprint();
			this.sprints = await this.project.getSprints({ finished: 0 });

			for (let i = 0; i < this.sprints.content.length; i++) {
				//issue fetching
				let tempIssues = await this.project.searchIssues({
					inSprint: this.sprints.content[i],
				});
				// let tempIssues = await this.sprints.content[i].getIssues();
				this.sprint_issues.push(tempIssues);
			}

			//move active sprint to first pos
			if (this.active_sprint != null) {
				let sprint_index = this.sprints.content.findIndex(
					(obj) => parseInt(obj.id) == parseInt(this.active_sprint.id)
				);

				//move issues array
				[this.sprint_issues[0], this.sprint_issues[sprint_index]] = [
					this.sprint_issues[sprint_index],
					this.sprint_issues[0],
				];

				//move sprints
				[this.sprints.content[0], this.sprints.content[sprint_index]] =
					[
						this.sprints.content[sprint_index],
						this.sprints.content[0],
					];
			}

			//filter data
			this.labels = await this.project.getLabels();

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
	width: 145px;
	font-size: 16px;
}

#create-sprint-button {
	height: 36px;
	margin-bottom: 24px;
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

.filter-box {
	width: 150px;
}
</style>
