<template>
	<div class="drag-container" v-drag-and-drop:options="options">
		<ul class="drag-list">
			<div class="drag-column" v-for="sprint in sprints" :key="sprint.id">
				<!-- optional renderless component -->
				<SprintBox :sprint="sprint">
					<vue-draggable-group
						v-model="sprint.issues"
						:groups="sprints"
						:data-id="sprint.id"
						@change="onGroupsChange"
					>
						<div class="drag-inner-list" :data-id="sprint.id">
							<IssueRow
								class="drag-item"
								v-for="issue in sprint.issues"
								:key="issue.id"
								:data-id="issue.id"
								:issue="issue"
							/>
						</div>
					</vue-draggable-group>
				</SprintBox>
			</div>
		</ul>
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
			sprints: [
				{
					name: 'Example Sprint',
					start_date: new Date('08/14/2020'),
					end_date: new Date('09/14/2020'),
					active: true,
					exists_active: true,
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
							id: 2,
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
					name: 'Example Sprint',
					start_date: new Date(1995, 1, 17),
					end_date: new Date(1995, 11, 17),
					active: false,
					exists_active: true,
					issues: [
						{
							color: '#EE0000',
							type: 'task',
							id: 3,
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
							id: 4,
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
				reactivityEnabled: true,
				// multipleDropzonesItemsDraggingEnabled: true,
				// showDropzoneAreas: true,
				// onDrop: function (event) {},
				// onDragstart: function (event) {},
				// onDragenter: function (event) {},
				// onDragover: function (event) {},
				// onDragend: function (event) {},
			};
		},
	},
	methods: {
		added() {
			console.log('added');
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

<style lang="scss"></style>
