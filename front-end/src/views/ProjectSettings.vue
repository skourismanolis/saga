<template>
	<div v-if="project === null">
		<b-spinner />
	</div>
	<form v-else class="d-flex flex-row">
		<div class="left d-flex flex-column mb60">
			<div classs="d-flex flex-row title-row">
				<span class="black-text title">Ρυθμίσεις </span>
				<span class="purple-text title">project </span>
			</div>
			<img
				:src="project.picture || DEFAULT_PICTURE"
				width="128px"
				height="128px"
				class="rounded-circle"
			/>
			<div class="form-group" id="choose-file-container">
				<label
					>Αλλαγή εικόνας...
					<b-input-group>
						<b-form-file
							accept="image/jpeg, image/png"
							v-model="selectedPicture"
							class="file-button"
						/>
						<b-input-group-append>
							<b-btn
								variant="primary"
								@click="savePicture"
								:disabled="selectedPicture == null"
								><i class="bi bi-check-lg"></i
							></b-btn>
						</b-input-group-append>
					</b-input-group>
				</label>
			</div>
			<span class="black-text mb12"> Τίτλος Project </span>
			<div class="input-group mb12">
				<b-input
					type="text"
					class="form-control"
					placeholder="Recipient's username"
					v-model="projectTitle"
				/>
				<div class="input-group-append">
					<button
						class="btn btn-primary"
						type="button"
						@click="saveTitle"
					>
						<i class="bi bi-check-lg"></i>
					</button>
					<button
						class="btn btn-outline-primary"
						type="button"
						@click="projectTitle = project.title"
					>
						<i class="bi bi-x-lg"></i>
					</button>
				</div>
			</div>
			<span class="black-text mb12"> Στείλε τον παρακάτω σύνδεσμο: </span>
			<div class="input-group mb60">
				<input
					type="text"
					class="form-control"
					v-model="invite"
					disabled
				/>
				<div class="input-group-append">
					<button class="btn btn-primary" @click.prevent="copy">
						Αντιγραφή
					</button>
				</div>
			</div>
			<button type="button" class="btn btn-danger mb12">
				Διαγραφή Project
			</button>
		</div>
		<div class="right">
			<div class="mb24">
				<span class="black-text mb12">Διαχειριστές</span>
				<div class="mb12">
					<span class="table-sect-name">Όνομα</span>
					<span class="table-sect-email">E-mail</span>
				</div>
				<MemberRow
					v-for="(admin, index) in admins"
					:key="index"
					:member="admin"
					class="list-item"
					v-bind:class="{ oddrow: index % 2 != 0 }"
					@promote="promoteMember"
					@demote="demoteMember"
					@delete="deleteMember"
				/>
			</div>
			<div class="mb24">
				<span class="black-text mb12">Μέλη</span>
				<div class="mb12">
					<span class="table-sect-name">Όνομα</span>
					<span class="table-sect-email">E-mail</span>
				</div>
				<MemberRow
					v-for="(member, index) in members"
					:key="index"
					:member="member"
					class="list-item"
					v-bind:class="{ oddrow: index % 2 != 0 }"
					@promote="promoteMember"
					@demote="demoteMember"
					@delete="deleteMember"
				/>
			</div>
		</div>
	</form>
</template>

<script>
const DEFAULT_PICTURE = require(`@/assets/profile pics/default-profile-pic.png`);

import MemberRow from '../components/MemberRow.vue';
export default {
	components: {
		MemberRow,
	},
	data() {
		return {
			project: null,
			projectTitle: '',
			selectedPicture: null,
			admins: [],
			members: [],
			invite: '',
		};
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
	},
	methods: {
		async savePicture() {
			try {
				await this.project.setPicture({
					picture: this.selectedPicture,
				});
				await this.project.refresh();
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},
		async saveTitle() {
			try {
				await this.project.update({ title: this.projectTitle });
			} catch (error) {
				alert(error);
			}
		},
		async promoteMember(member) {
			try {
				await this.project.promoteAdmin({ member });
				await this.refreshMembers();
			} catch (error) {
				alert(error);
			}
		},
		async demoteMember(member) {
			try {
				await this.project.demoteAdmin({ member });
				await this.refreshMembers();
			} catch (error) {
				alert(error);
			}
		},
		async deleteMember(member) {
			try {
				await this.project.deleteMember({ member });
				await this.refreshMembers();
			} catch (error) {
				alert(error);
			}
		},
		async refreshMembers() {
			[this.members, this.admins] = await Promise.all([
				this.project.getNonAdmins(),
				this.project.getAdmins(),
			]);
		},
		async copy() {
			await navigator.clipboard.writeText(this.invite);
		},
	},
	async created() {
		try {
			this.project = await this.$client.getProject({
				idProject: this.$route.params.idProject,
			});
			await this.refreshMembers();
			this.projectTitle = this.project.title;
			let link = await this.project.getInvite();
			link = link.split('/');
			let token = link[link.length - 1];
			let current = window.location.toString();
			this.invite =
				current.slice(0, current.indexOf('/projects/')) +
				'/invite?token=' +
				token;
		} catch (error) {
			alert(error);
		}
	},
};
</script>

<style scoped>
.left {
	margin-top: 108px;
	margin-left: 108px;
	margin-right: 97px;
	width: 369px;
}

.title {
	font-weight: bold;
}

.rounded-circle {
	margin-top: 36px;
	margin-bottom: 12px;
}

.black-text {
	font-size: 24px;
}

.purple-text {
	font-size: 36px;
	color: #564787;
}

.mb12 {
	margin-bottom: 12px;
}

.ml12 {
	margin-left: 12px;
}

.mb60 {
	margin-bottom: 60px;
}

.mb24 {
	margin-bottom: 24px;
}

.right {
	margin-top: 193px;
	width: 769px;
}

.table-sect-name {
	margin-left: 12px;
}

.table-sect-email {
	margin-left: 254px;
}

.oddrow {
	background-color: white !important;
}

.list-item {
	border-radius: 4pt;
}
</style>
