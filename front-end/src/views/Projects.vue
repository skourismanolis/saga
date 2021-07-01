<template>
	<div class="view-container d-flex flex-column">
		<div class="mb36">
			<span class="black-text">Τα</span>
			<span class="purple-text">project</span>
			<span class="black-text">μου</span>
		</div>
		<span v-if="projects.length == 0" class="empty-projects-message"
			>Δεν έχεις ξεκινήσει κανένα project ακόμα, φτιάξε το πρώτο σου
			project τώρα!
		</span>
		<div class="d-flex flex-row buttons-search-container mb36">
			<button
				type="button"
				class="btn btn-primary d-flex align-items-center create-button"
				v-b-modal.create-project-modal
			>
				Δημιουργία
				<i class="bi bi-plus align-self-center"></i>
			</button>

			<!-- modal -->
			<b-modal id="create-project-modal">
				<!-- header -->

				<template #modal-header="{}">
					<div>
						<span class="black-text-modal">Δημιουργία</span>
						<span class="purple-text-modal">project</span>
					</div>
				</template>
				<!-- content -->
				<div class="d-flex flex-column justify-content-center mb12">
					<img
						:src="new_project.pic"
						width="128px"
						height="128px"
						class="rounded-circle align-self-center"
					/>
					<div class="input-group">
						<div class="custom-file">
							<input
								type="file"
								class="custom-file-input"
								id="inputGroupFile04"
							/>
							<label
								class="custom-file-label"
								for="inputGroupFile04"
								>Επέλεξε αρχείο</label
							>
						</div>
					</div>
				</div>
				<label for="exampleInputEmail1">Τίτλος Project</label>
				<input
					type="text"
					class="form-control mb12"
					placeholder="Εισάγετε τίτλο..."
				/>
				<label for="exampleInputEmail1"
					>Προσκάλεσε τα μέλη της ομάδας</label
				>

				<div class="input-group mb12">
					<input
						type="emai"
						class="form-control mb12"
						placeholder="Εισάγετε το e-mail του μέλους..."
					/>
					<div class="input-group-append">
						<button class="btn btn-primary" type="button">
							<i class="bi bi-envelope"></i>
						</button>
					</div>
				</div>
				<label for="exampleInputEmail1"
					>Ή στείλτε τον παρακάτω σύνδεσμο</label
				>
				<div class="input-group mb12">
					<input
						type="text"
						class="form-control"
						v-model="generatedLink"
						disabled
					/>
					<div class="input-group-append">
						<button class="btn btn-primary" type="button">
							Αντιγραφή
						</button>
					</div>
				</div>
				<div class="d-flex justify-content-center">
					<img src="../assets/plant.png" />
				</div>
				<!-- footer -->
				<template #modal-footer="{ cancel, ok }">
					<b-button size="sm" variant="danger" @click="cancel()">
						Ακύρωση
					</b-button>
					<b-button size="sm" variant="primary" @click="ok()">
						Αποθήκευση
					</b-button>
				</template>
			</b-modal>

			<div class="input-group search-field" v-if="projects.length > 0">
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
			v-if="projects.length == 0"
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
				v-bind:class="{ oddrow: index % 2 != 0 }"
				v-for="(project, index) in projects"
				:key="index"
				:project="project"
			/>
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
				pic: require('../assets/profile pics/default-profile-pic.png'),
			},

			projects: [
				{
					pic: require('../assets/profile pics/default-profile-pic.png'),
					name: 'Example Project',
					admins: [
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
					],
					members: [
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
					],
				},
				{
					pic: require('../assets/profile pics/default-profile-pic.png'),
					name: 'Example Project',
					admins: [
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
					],
					members: [
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
					],
				},
				{
					pic: require('../assets/profile pics/default-profile-pic.png'),
					name: 'Example Project',
					admins: [
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
					],
					members: [
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
						require('../assets/profile pics/default-profile-pic.png'),
					],
				},
			],
		};
	},
	computed: {},
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
