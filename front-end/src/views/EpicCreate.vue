<template>
	<div class="d-flex justify-content-center">
		<form class="d-flex flex-column justify-content-start container">
			<div class="d-flex flex-row align-items-center container-element">
				<i class="bi bi-hourglass epic-icon"></i>
				<input
					type="text"
					class="form-control epic-title-input"
					placeholder="Εισάγετε τίτλο..."
				/>
			</div>
			<div class="d-flex flex-row container-element">
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
					></b-form-datepicker>
				</div>
				<div class="d-flex flex-column date-col-container">
					<span class="label-text">ΗΜΕΡΟΜΗΝΙΑ ΛΗΞΗΣ</span>
					<b-form-datepicker
						id="datepicker"
						class="mb-2"
					></b-form-datepicker>
				</div>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΠΕΡΙΓΡΑΦΗ</span>
				<textarea
					class="form-control"
					placeholder="Εισάγετε περιγραφή..."
				></textarea>
			</div>
			<div class="d-flex flex-column container-element">
				<span class="label-text">ΣΥΝΟΛΟΛΙΚΟΙ ΠΟΝΤΟΙ</span>
				<span>{{ totalPoints }}</span>
			</div>
			<EpicIssueBox class="box container-element" :issues="epic_issues" />
			<BacklogBox
				class="box container-element"
				:issues="issues"
				:buttonActive="false"
			/>
			<button
				type="submit"
				class="btn btn-primary align-self-end submit-button"
				@click="true"
			>
				Δημιουργία Epic
			</button>
		</form>
	</div>
</template>

<script>
import BacklogBox from '../components/BacklogBox.vue';
import EpicIssueBox from '../components/EpicIssueBox.vue';

export default {
	components: {
		BacklogBox,
		EpicIssueBox,
	},
	data() {
		return {
			epic_issues: [],
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
		};
	},
	computed: {
		totalPoints() {
			if (this.issues.length > 0) {
				let points = 0;

				for (let i in this.epic_issues) {
					points += this.epic_issues[i].points;
				}
				return points;
			}
			return 0;
		},
	},
	methods: {},
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

.submit-button {
	width: 200px;
}
</style>
