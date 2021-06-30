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
			>
				Δημιουργία
				<i class="bi bi-plus align-self-center"></i>
			</button>
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
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			projects: [],
		};
	},
	computed: {},
};
</script>

<style scoped>
.mb36 {
	margin-bottom: 36px;
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
	margin: 108px 64px;
}

.purple-text {
	margin-left: 10px;
	margin-right: 10px;
	font-weight: bold;
	color: #564787;
	font-size: 48px;
}

.black-text {
	font-weight: bold;
	font-size: 36px;
}
</style>
