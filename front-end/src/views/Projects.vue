<template>
	<div class="view-container d-flex flex-column">
		<div class="mb36">
			<span class="black-text">Τα</span>
			<span class="purple-text">project</span>
			<span class="black-text">μου</span>
		</div>
		<div v-if="projects == null"><b-spinner /></div>
		<div v-else>
			<span v-if="projects.total == 0" class="empty-projects-message"
				>Δεν έχεις ξεκινήσει κανένα project ακόμα, φτιάξε το πρώτο σου
				project τώρα!
			</span>
			<div class="d-flex flex-row buttons-search-container mb36">
				<button
					type="button"
					class="
						btn btn-primary
						d-flex
						align-items-center
						create-button
					"
					v-b-modal.create-project-modal
				>
					Δημιουργία
					<i class="bi bi-plus align-self-center"></i>
				</button>

				<!-- modal -->
				<b-modal
					id="create-project-modal"
					cancel-title="Ακύρωση"
					cancel-variant="danger"
					ok-title="Αποθήκευση"
					@ok="createProject"
				>
					<!-- header -->
					<template #modal-header="{}">
						<div>
							<span class="black-text-modal">Δημιουργία</span>
							<span class="purple-text-modal">project</span>
						</div>
					</template>

					<!-- content -->
					<label for="exampleInputEmail1">Τίτλος Project</label>
					<b-input
						type="text"
						class="mb12"
						v-model="new_project.title"
						placeholder="Εισάγετε τίτλο..."
					/>
					<div class="d-flex justify-content-center">
						<img src="../assets/plant.png" />
					</div>
				</b-modal>

				<div
					class="input-group search-field"
					v-if="projects.length > 0"
				>
					<input
						type="text"
						class="form-control"
						placeholder="Αναζήτηση..."
					/>
					<div class="input-group-append">
						<button class="btn btn-primary" type="button">
							<i class="bi bi-search"></i>
						</button>
					</div>
				</div>
			</div>

			<img
				v-if="projects.total == 0"
				class="align-self-center"
				src="../assets/empty-projects-art.png"
			/>
			<div v-else class="list-container">
				<div class="mb12">
					<span class="title-label">Τίτλος</span>
					<span class="admins-label">Διαχειριστές</span>
					<span class="members-label">Μέλη</span>
				</div>
				<ProjectRow
					class="project-row"
					:class="{ oddrow: index % 2 != 0 }"
					v-for="(project, index) in projects.content"
					:key="index"
					:project="project"
				/>
				<div class="d-flex justify-content-center mt-4">
					<b-pagination
						v-model="currentPage"
						:total-rows="projects.total"
						:per-page="projects.perPage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ProjectRow from '../components/ProjectRow.vue';
export default {
	components: {
		ProjectRow,
	},
	data() {
		return {
			new_project: {
				title: '',
			},
			projects: null,
		};
	},
	computed: {
		currentPage: {
			get: function () {
				if (this.projects != null) return this.projects.currentPage + 1;
				else return 1;
			},
			set: async function (page) {
				if (this.projects != null)
					await this.projects.setPage(page - 1);
			},
		},
	},
	methods: {
		async createProject() {
			let project = await this.$client.createProject({
				title: this.new_project.title,
			});
			this.$router.push(`/projects/${project.id}/settings`);
		},
	},
	async created() {
		this.projects = await this.$client.getProjects();
	},
};
</script>

<style scoped>
.custom-file {
	margin: 12px 0;
}

.mb36 {
	margin-bottom: 36px;
}

.mb12 {
	margin-bottom: 12px;
}

.empty-projects-message {
	font-size: 18px;
	margin-bottom: 24px;
}

.buttons-search-container {
	height: 38px;
}

.search-field {
	width: 287px;
}

.create-button {
	width: 165px;
	margin-right: 16px;
}

.create-button i {
	font-size: 24px;
}

.view-container {
	padding: 108px 64px;
}

.purple-text {
	margin-left: 10px;
	margin-right: 10px;
	font-weight: bold;
	color: #564787;
	font-size: 48px;
}

.black-text {
	font-size: 36px;
}

.black-text-modal {
	font-size: 24px;
	font-weight: bold;
}

.purple-text-modal {
	font-weight: bold;

	font-size: 36px;
	color: #564787;
	margin-left: 10px;
}
.oddrow {
	background-color: white !important;
}

.project-row {
	border-radius: 4pt;
}

.title-label {
	margin-left: 12px;
}

.list-container {
	position: relative;
}

.admins-label {
	position: absolute;
	right: 0;
	margin-right: 410px;
}

.members-label {
	position: absolute;
	right: 0;
	margin-right: 167px;
}
</style>
