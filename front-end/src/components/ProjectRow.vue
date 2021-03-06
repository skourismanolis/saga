<template>
	<router-link
		class="d-flex flex-row align-items-center project-entry"
		:to="`/projects/${project.id}/backlog`"
	>
		<img
			:src="project.picture || DEFAULT_PICTURE"
			width="24px"
			height="24px"
			class="rounded-circle align-self-center mr8"
		/>
		<span class="project-name">{{ project.title }}</span>
		<div class="ml-auto members-container d-flex flex-row">
			<a
				v-for="(admin, index) in firstNadmins"
				:key="index"
				v-b-tooltip.hover="admin.name + ' ' + admin.surname"
			>
				<img
					:src="picOrDefault(admin)"
					width="24px"
					height="24px"
					class="rounded-circle align-self-center mr8"
				/>
			</a>
			<a
				v-if="admins.length > MAX_USERS"
				class="
					d-flex
					flex-row
					align-items-center
					justify-content-center
					overflow-num
				"
				v-b-tooltip.hover="admins.length + ' ακόμα χρήστες'"
			>
				{{ '+' + (admins.length - MAX_USERS) }}
			</a>
		</div>
		<div class="ml100 members-container d-flex flex-row">
			<a
				v-for="(member, index) in firstNmembers"
				:key="index"
				v-b-tooltip.hover="member.name + ' ' + member.surname"
			>
				<img
					:src="picOrDefault(member)"
					width="24px"
					height="24px"
					class="rounded-circle align-self-center mr8"
				/>
			</a>
			<a
				id="issue-assignees-num"
				v-if="members.length > MAX_USERS"
				class="
					d-flex
					flex-row
					align-items-center
					justify-content-center
					overflow-num
				"
				v-b-tooltip.hover="members.length + ' ακόμα χρήστες'"
			>
				{{ '+' + (members.length - MAX_USERS) }}
			</a>
		</div>
	</router-link>
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
			if (this.admins.length < MAX_USERS) return this.admins;
			else {
				return this.admins.slice(0, MAX_USERS);
			}
		},
		firstNmembers() {
			if (this.members.length < MAX_USERS) return this.members;
			else {
				return this.members.slice(0, MAX_USERS);
			}
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
a {
	color: initial !important;
	text-decoration: none !important;
}

a:hover {
	text-decoration: none !important;
}

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
