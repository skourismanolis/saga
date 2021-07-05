<template>
	<div class="d-flex flex-row align-items-center member-entry">
		<div class="text-container">
			<img
				:src="member.picture || DEFAULT_PICTURE"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center member-element ml12"
			/>

			<span class="member-element ml12">{{ member.name }}</span>
		</div>

		<span class="member-element email">{{ member.email }}</span>

		<div class="ml-auto" v-bind:class="{ invisible: member.admin == true }">
			<a v-if="member.role !== 'Admin'" @click="$emit('promote', member)">
				<i class="icon bi bi-arrow-up"></i>
			</a>
			<a
				v-else-if="member.id != $store.state.user.idUser"
				@click="$emit('demote', member)"
				><i class="icon bi bi-arrow-down"></i
			></a>
			<a
				v-if="member.id != $store.state.user.idUser"
				@click="$emit('delete', member)"			>
				<i class="icon bi bi-x-circle ml12 mr12 icon"></i>
			</a>
		</div>
	</div>
</template>

<script>
const DEFAULT_PICTURE = require(`@/assets/profile pics/default-profile-pic.png`);

export default {
	components: {},
	props: {
		member: Object,
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
	},
};
</script>

<style scoped>
.member-entry {
	height: 40px;
	background-color: #f1f2f8;
}

.ml12 {
	margin-left: 12px;
}

.mr12 {
	margin-right: 12px;
}

.member-entry:hover {
	cursor: pointer;
	filter: brightness(90%);
}

.icon {
	font-size: 24px;
}

.icon.bi-arrow-up {
	color: #564787;
}

.icon.bi-x-circle {
	color: #db5461;
}

.invisible {
	visibility: hidden;
}

.text-container {
	width: 190px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.email {
	margin-left: 124px;
}
</style>
