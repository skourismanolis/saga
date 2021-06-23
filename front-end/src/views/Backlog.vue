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
				<table class="table table-striped table-hover">
					<tbody>
						<tr v-for="epic in epics" :key="epic.name">
							<td>Mark</td>
							<td>Otto</td>
							<td>@mdo</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="d-flex flex-column" id="right"></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// epicsList: [],
			epics: [
				{
					name: 'Example Epic',
					date: new Date('2012-02-03'),
					storyPoints: 10,
					issuesList: [],
				},

				{
					name: 'Example Epic',
					date: new Date('2012-02-03'),
					storyPoints: 10,
					issuesList: [],
				},
			],
		};
	},
	computed: {},
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

#epic-container {
	background-color: white;
}

#right {
}
</style>
