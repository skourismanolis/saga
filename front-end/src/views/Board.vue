<template>
	<div v-if="!loaded"><b-spinner /></div>
	<div v-else class="p-4">
		<TeamList class="mb-4 ml-3" :members="members" :max="10" />
		<div class="d-flex" v-drag-and-drop:options="dropOptions">
			<div
				class="column rounded-sm todo drag-inner-list"
				:id="columnIds[0]"
			>
				<h3>TODO</h3>
				<IssueCard
					class="my-2 drag-item"
					v-for="issue in columnIssues[0].content"
					:key="issue.code"
					:id="issue.code"
				/>
			</div>
			<div
				class="column rounded-sm in-progress drag-inner-list"
				:id="columnIds[1]"
			>
				<h3>IN PROGRESS</h3>
				<IssueCard
					class="my-2 drag-item"
					v-for="issue in columnIssues[1].content"
					:key="issue.code"
					:id="issue.code"
				/>
			</div>
			<div
				class="column rounded-sm done drag-inner-list"
				:id="columnIds[2]"
			>
				<h3>DONE</h3>
				<IssueCard
					class="my-2 drag-item"
					v-for="issue in columnIssues[2].content"
					:key="issue.code"
					:id="issue.code"
				/>
			</div>
			<div>
				<div>
					<a class="hand">
						<span class="bg-gray px-2 py-1 rounded-sm">
							<b-icon icon="search" class="text-white" />
						</span>
						Αναζήτηση
					</a>
				</div>
				<div class="mt-2">
					<a class="hand" v-b-modal.viewIssue>
						<span class="bg-gray px-2 py-1 rounded-sm">
							<b-icon icon="plus" class="text-white" />
						</span>
						Νέο Issue
					</a>
				</div>
				<CategorySelector
					class="mt-2"
					:labels="labels"
					v-model="selectedLabel"
					@input="refreshAllIssues"
					@addLabel="addLabel"
				/>
			</div>
		</div>
		<b-modal id="viewIssue"><IssueCreate /> </b-modal>
		<b-modal id="editLabel" @ok="saveLabel">
			<label>
				Όνομα
				<b-input v-model="currentLabel.name" />
			</label>
			<label>
				Χρώμα
				<b-input v-model="currentLabel.color" />
			</label>
		</b-modal>
	</div>
</template>

<script>
import IssueCard from '@/components/IssueCard.vue';
import TeamList from '@/components/TeamList.vue';
import IssueCreate from '@/components/IssueCreate.vue';
import CategorySelector from '@/components/CategorySelector.vue';

export default {
	name: 'Board',
	components: {
		IssueCard,
		TeamList,
		IssueCreate,
		CategorySelector,
	},
	data() {
		return {
			currentLabel: {
				label: null,
				name: '',
				color: '',
			},
			loaded: false,
			project: null,
			members: null,
			labels: null,
			columnIds: [],
			columnIssues: [],
			selectedLabel: null,
		};
	},
	computed: {
		dropOptions() {
			return {
				dropzoneSelector: '.drag-inner-list',
				draggableSelector: '.drag-item',
				onDrop: this.drop,
			};
		},
	},
	methods: {
		async addLabel() {
			this.$bvModal.show('editLabel');
		},
		async editLabel(label) {
			this.currentLabel.label = label;
			this.currentLabel.name = label.name;
			this.currentLabel.color = label.color;
		},
		async saveLabel(evt) {
			if (this.currentLabel.color.match(/^#[a-fA-f0-9]{6}$/) == null) {
				evt.preventDefault();
				return alert(
					'Παρακαλώ βάλετε εναν σωστό κωδικό χρώματως. Π.χ. #ABCD12'
				);
			}
			try {
				let newLabel = {
					name: this.currentLabel.name,
					color: this.currentLabel.color,
				};
				if (this.currentLabel.label === null) {
					//new label
					await this.project.createLabel(newLabel);
				} else {
					this.currentLabel.label.update(newLabel);
				}
				this.resetEditLabel();
				await this.refreshLabels();
			} catch (error) {
				console.error(error);
			}
		},
		resetEditLabel() {
			this.currentLabel.name = '';
			this.currentLabel.label = null;
			this.currentLabel.color = '';
		},
		async drop(e) {
			try {
				let issue = await this.project.getIssue(e.items[0].id);
				await issue.update({ idColumn: e.droptarget.id || null });
				await this.refreshAllIssues();
			} catch (error) {
				alert(error);
			}
		},
		async refreshAllIssues() {
			let params = {};
			if (this.selectedLabel != null) {
				params.labels = [this.selectedLabel];
			}
			let columns = await this.project.getColumns();
			this.columnIds = columns.map((c) => c.id);
			this.columnIssues = await Promise.all([
				...columns.map((c) =>
					this.project.searchIssues({ column: c, ...params })
				),
				this.project.searchIssues({ column: null, ...params }),
			]);
		},
		async refreshLabels() {
			this.labels = await this.project.getLabels();
		},
	},
	async created() {
		try {
			this.project = await this.$client.getProject({
				idProject: this.$route.params.idProject,
			});
			this.members = await this.project.getMembers();
			await this.refreshLabels();
			await this.refreshAllIssues();
			this.loaded = true;
		} catch (error) {
			alert(error);
		}
	},
};
</script>

<style scoped>
a {
	color: initial !important;
	text-decoration: none !important;
}
.hand {
	cursor: pointer;
}
.bg-gray {
	background-color: #aaa;
}
.todo {
	background-color: #fcd57f;
}

.in-progress {
	background-color: #efb0b7;
}

.done {
	background-color: #7b7393;
}
.column {
	width: 350px;
	padding-top: 32px;
	padding-bottom: 16px;
	padding-left: 12px;
	padding-right: 12px;
	margin-left: 12px;
	margin-right: 12px;
	color: white;
}
</style>
