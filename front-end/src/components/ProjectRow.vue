<template>
	<div class="d-flex flex-row align-items-center project-entry">
		<img
			:src="project.pic"
			width="24px"
			height="24px"
			class="rounded-circle align-self-center mr8"
		/>
		<span id="project-name">{{ project.name }}</span>
		<div class="ml-auto members-container d-flex flex-row">
			<img
				v-for="(admin, index) in firstNadmins"
				:key="index"
				:src="project.admins[index]"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center mr8"
			/>
			<div
				v-if="project.admins.length > n"
				class="
					d-flex
					flex-row
					align-items-center
					justify-content-center
					overflow-num
				"
			>
				{{ '+' + (project.admins.length - n) }}
			</div>
		</div>
		<div class="ml100 members-container d-flex flex-row">
			<img
				v-for="(member, index) in firstNmembers"
				:key="index"
				:src="project.members[index]"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center mr8"
			/>
			<div
				id="issue-assignees-num"
				v-if="project.members.length > n"
				class="
					d-flex
					flex-row
					align-items-center
					justify-content-center
					overflow-num
				"
			>
				{{ '+' + (project.members.length - n) }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	props: {
		project: Object,
	},
	data() {
		return {
			n: 5,
			membersTrimmed: false,
			adminsTrimmed: false,
		};
	},
	computed: {
		firstNadmins() {
			if (this.project.admins.length < this.n)
				return this.project.admins.length;
			else {
				return this.project.admins.slice(0, this.n);
			}
		},
		firstNmembers() {
			if (this.project.members.length < this.n)
				return this.project.members.length;
			else {
				return this.project.members.slice(0, this.n);
			}
		},
	},
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

.overflow-num {
	background-color: white;
	font-size: 16px;

	width: 24px;
	height: 24px;

	-moz-border-radius: 50px;
	-webkit-border-radius: 50px;
	border-radius: 50px;

	border-style: solid;
	border-color: black;
	border-width: 1px;
}
</style>
