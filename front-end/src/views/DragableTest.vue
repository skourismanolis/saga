<template>
	<div
		class="drag-container"
		v-drag-and-drop:options="options"
		@onDragstart="added"
	>
		<vue-draggable-group
			v-for="sprint in sprints"
			v-model="sprint.issues"
			:groups="sprints"
			itemsKey="issues"
			:key="sprint.id"
			:data-id="sprint.id"
			@change="onGroupsChange"
		>
			<SprintBox :sprint="sprint" class="drag-inner-list">
				<IssueRow
					v-for="issue in sprint.issues"
					:key="issue.id"
					:data-id="issue.id"
					:issue="issue"
					class="drag-item"
				/>
			</SprintBox>
		</vue-draggable-group>
	</div>
</template>

<script>
import SprintBox from '../components/SprintBox.vue';
import IssueRow from '../components/IssueRow.vue';

export default {
	components: {
		SprintBox,
		IssueRow,
	},
	data() {
		return {
			test: {
				items: 123,
			},

			sprints: [
				{
					id: 1,
					name: 'Example Sprint',
					start_date: new Date('08/14/2020'),
					end_date: new Date('09/14/2020'),
					active: true,
					exists_active: true,
					issues: [
						{
							id: 1,
							sprintId: 1,
							color: '#EE0000',
							type: 'task',
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
							id: 2,
							sprintId: 1,
							color: '#047C97',
							type: 'story',
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

				{
					id: 2,
					name: 'Example Sprint',
					start_date: new Date(1995, 1, 17),
					end_date: new Date(1995, 11, 17),
					active: false,
					exists_active: true,
					issues: [
						{
							id: 3,
							sprintId: 2,
							color: '#EE0000',
							type: 'task',
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
							id: 4,
							sprintId: 2,
							color: '#047C97',
							type: 'story',
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
						{
							id: 5,
							sprintId: 2,
							color: '#047C97',
							type: 'story',
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
			],
		};
	},
	computed: {
		options() {
			return {
				dropzoneSelector: '.drag-inner-list',
				draggableSelector: '.drag-item',
				// handlerSelector: null,
				// reactivityEnabled: true,
				// multipleDropzonesItemsDraggingEnabled: true,
				// showDropzoneAreas: false,
				onDrop: this.added(),
				// onDragstart: function (event) {},
				// onDragenter: function (event) {},
				// onDragover: function (event) {},
				// onDragend: function (event) {},
			};
		},
	},
	methods: {
		added() {
			console.log(this.test['items']);
		},
		removed() {
			console.log('removed');
		},
		reordered() {
			console.log('reordered');
		},
		onGroupsChange(e) {
			console.log({ e });
		},
	},
};
</script>

<style scoped>
.drag-inner-list {
}
</style>
