<template>
	<div>
		<b-avatar-group size="36px" id="team">
			<b-avatar
				v-for="member in printMembers"
				:key="member"
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
		show: Number,
	},
	computed: {
		printMembers() {
			if (this.show == 0) return this.members; //not having === won't cause a problem here

			return this.members.slice(0, this.show);
		},
	},
};
</script>

<style scoped></style>
