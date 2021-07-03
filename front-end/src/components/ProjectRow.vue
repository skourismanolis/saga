<template>
	<div class="d-flex flex-row align-items-center project-entry">
		<img
			:src="project.picture || DEFAULT_PICTURE"
			width="24px"
			height="24px"
			class="rounded-circle align-self-center mr8"
		/>
		<span id="project-name">{{ project.title }}</span>
		<div class="ml-auto members-container d-flex flex-row">
			<img
				v-for="(admin, index) in firstNadmins"
				:key="index"
				:src="admin.picture || DEFAULT_PICTURE"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center mr8"
			/>
			<div
				v-if="admins.length > MAX_USERS"
				class="
					d-flex
					flex-row
					align-items-center
					justify-content-center
					overflow-num
				"
			>
				{{ '+' + (admins.length - MAX_USERS) }}
			</div>
		</div>
		<div class="ml100 members-container d-flex flex-row">
			<img
				v-for="(member, index) in firstNmembers"
				:key="index"
				:src="member || picture"
				width="24px"
				height="24px"
				class="rounded-circle align-self-center mr8"
			/>
			<div
				id="issue-assignees-num"
				v-if="members.length > MAX_USERS"
				class="
					d-flex
					flex-row
					align-items-center
					justify-content-center
					overflow-num
				"
			>
				{{ '+' + (members.length - MAX_USERS) }}
			</div>
		</div>
	</div>
</template>

<script>
const DEFAULT_PICTURE = require('@/assets/profile pics/default-profile-pic.png');
const MAX_USERS = 5;

export default {
	components: {},
	props: {
		project: Object,
	},
	data() {
		return {
			admins: [],
			members: [],
		};
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
		MAX_USERS() {
			return MAX_USERS;
		},
		firstNadmins() {
			if (this.admins.length < MAX_USERS) return this.admins.length;
			else {
				return this.admins.slice(0, MAX_USERS);
			}
		},
		firstNmembers() {
			if (this.members.length < MAX_USERS) return this.members.length;
			else {
				return this.members.slice(0, MAX_USERS);
			}
		},
	},
	async mounted() {
		[this.admins, this.members] = await Promise.all([
			this.project.getAdmins(),
			this.project.getNonAdmins(),
		]);
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
