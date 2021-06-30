<template>
	<div class="d-flex justify-content-center">
		<form class="d-flex flex-column justify-content-start container">
			<div class="d-flex flex-row align-items-baseline container-element">
				<i class="bi bi-hourglass epic-icon"></i>
				<span class="epic-title-input">
					{{ epic.name }}
				</span>
			</div>
			<div class="d-flex flex-row container-element">
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ</span>
					<span class="epic-title-input label-text">
						<i class="bi bi-calendar-date"></i>
						{{ epic.start_date }}
					</span>
				</div>
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΛΗΞΗΣ</span>
					<span class="epic-title-input label-text">
						<i class="bi bi-calendar-date"></i>
						{{ epic.end_date }}
					</span>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΠΕΡΙΓΡΑΦΗ</span>
				<span class="label-text">{{ epic.description }}</span>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΣΥΝΟΛΟΛΙΚΟΙ ΠΟΝΤΟΙ</span>
				<span>{{ totalPoints }}</span>
			</div>
			<EpicIssueBox class="box container-element" :issues="epic.issues" />

			<button
				type="submit"
				class="btn btn-primary align-self-end edit-button"
				@click="redirectEpicEdit()"
			>
				Επεξεργασία Epic
			</button>
		</form>
	</div>
</template>

<script>
import EpicIssueBox from '../components/EpicIssueBox.vue';

export default {
	components: {
		EpicIssueBox,
	},
	data() {
		return {
			epic: {
				name: 'Example Epic',
				start_date: '28 Μαρτίου 2021',
				end_date: '28 Μαρτίου 2021',
				description:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros magna, finibus sit amet tellus quis, consequat tempus ligula. Fusce ante diam, facilisis sed dui quis, tristique fermentum purus. Proin iaculis mauris vel maximus vestibulum. Curabitur ut sem vitae mauris interdum sagittis sit amet eu enim. Phasellus a condimentum est. Proin diam nisl, gravida id pulvinar vel, tempor eleifend nunc. Nulla porttitor nunc ut ultricies fermentum. ',
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
		};
	},
	computed: {
		totalPoints() {
			if (this.epic.issues.length > 0) {
				let points = 0;

				for (let i in this.epic.issues) {
					points += this.epic.issues[i].points;
				}
				return points;
			}
			return 0;
		},
	},
	methods: {
		redirectEpicEdit() {
			// let query = { activePlan: value };
			this.$router
				.push({ path: '/epic-edit' /*, query: query*/ })
				.catch(() => {});
		},
	},
};
</script>

<style scoped>
.container {
	margin: 48px 0;
	width: 1015px;
}

.container-element {
	margin-bottom: 24px;
}

.epic-icon {
	color: #db5461;
	font-size: 30px;

	margin-right: 12px;
}

.epic-title-input {
	width: 300px;
	height: 48px;
	font-size: 24px;
}

.label-text {
	font-size: 14px;
	margin-bottom: 8px;
}

.date-col-container {
	margin-right: 24px;
}

#date-picker {
	width: 147px;
}

.edit-button {
	width: 200px;
}
</style>
