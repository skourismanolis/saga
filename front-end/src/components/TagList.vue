<template>
	<div>
		<b-avatar-group size="sm">
			<a
				v-for="(assignee, idx) in current"
				:key="idx"
				@contextmenu.prevent="$emit('remove', assignee)"
			>
				<b-avatar :text="assignee" />
			</a>
			<a>
				<b-dropdown
					no-caret
					variant="link"
					toggle-tag="a"
					toggle-class="p-0"
				>
					<template #button-content>
						<b-avatar text="+" />
					</template>
					<b-dropdown-item
						v-for="(member, idx) in filteredMembers"
						:key="idx"
						@click="$emit('add', member)"
					>
						{{ member }}
					</b-dropdown-item>
				</b-dropdown>
			</a>
		</b-avatar-group>
	</div>
</template>

<script>
export default {
	name: 'TagList',
	props: {
		current: Array,
		members: Array,
	},
	data() {
		return {
			options: [
				'Apple',
				'Orange',
				'Banana',
				'Lime',
				'Peach',
				'Chocolate',
				'Strawberry',
			],
			search: '',
		};
	},
	computed: {
		filteredMembers() {
			return this.members.filter((m) => this.current.indexOf(m) === -1);
		},
	},
};
</script>
