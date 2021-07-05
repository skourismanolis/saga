<template>
	<div>
		<b-avatar-group size="36px" id="team">
			<b-avatar
				v-for="member in printMembers"
				:key="member"
				:text="member.username"
				v-b-popover.hover.top="member.username"
			>
			</b-avatar>
		</b-avatar-group>
	</div>
</template>

<script>
//in b-avatar print image
export default {
	props: {
		members: Array,
		max: Number,
	},
	computed: {
		printMembers() {
			if (this.max == 0) return this.members; //not having === won't cause a problem here

			return this.members.slice(0, this.max);
		},
	},
};
</script>

<style scoped></style>
