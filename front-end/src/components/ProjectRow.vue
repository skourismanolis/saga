<template>
	<div class="d-flex flex-row align-items-center project-entry">
		<img
			:src="project.pic"
			width="24px"
			height="24px"
			class="rounded-circle align-self-center mr8"
		/>
		<span id="project-name">{{ project.name }}</span>
		<div class="ml-auto members-container">
			<img
				v-for="(admin, index) in project.admins"
				:key="index"
				:src="project.admins[index]"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center ml-auto mr8"
			/>
		</div>
		<div class="ml100 members-container">
			<img
				v-for="(member, index) in project.members"
				:key="index"
				:src="project.members[index]"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center ml-auto mr8"
			/>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	props: {
		project: Object,
	},
	computed: {},
};
</script>

<style scoped>
.project-entry {
	height: 40px;
	padding: 12px;
	background-color: #f1f2f8;
}

.project-entry:hover {
	cursor: pointer;
	filter: brightness(90%);
}

.mr8 {
	margin-right: 8px;
}
.ml100 {
	margin-left: 100px;
}

.members-container {
	width: 192px;
}
</style>
