<template>
	<b-avatar-group :size="size" id="team">
		<b-avatar
			v-for="(member, idx) in printMembers"
			:key="idx"
			:text="getFullName(member)"
			:src="picOrDefault(member)"
			v-b-popover.hover.top="getFullName(member)"
		/>
	</b-avatar-group>
</template>

<script>
const DEFAULT_PICTURE = require(`@/assets/profile pics/default-profile-pic.png`);

//in b-avatar print image
export default {
	props: {
		members: Array,
		max: Number,
		size: {
			type: String,
			default: '52px',
		},
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
		printMembers() {
			if (this.max == 0) return this.members; //not having === won't cause a problem here

			return this.members.slice(0, this.max);
		},
	},
	methods: {
		picOrDefault(object) {
			if (object.picture != null) {
				return 'http://localhost:3000/profilePics/' + object.picture;
			} else {
				return DEFAULT_PICTURE;
			}
		},

		getFullName(member) {
			return member.name + ' ' + member.surname;
		},
	},
};
</script>

<style scoped></style>
