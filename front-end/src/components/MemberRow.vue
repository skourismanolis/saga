<template>
	<div class="d-flex flex-row align-items-center member-entry">
		<div class="text-container">
			<img
				:src="member.pic"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center member-element ml12"
			/>

			<span class="member-element ml12">{{ member.name }}</span>
		</div>

		<span class="member-element email">{{ member.email }}</span>

		<div class="ml-auto" v-bind:class="{ invisible: member.admin == true }">
			<i class="icon bi bi-arrow-up"></i>
			<i class="icon bi bi-x-circle ml12 mr12 icon"></i>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	props: {
		member: Object,
	},
	computed: {},
};
</script>

<style scoped>
.member-entry {
	height: 40px;
	background-color: white;
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

.member-element {
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
