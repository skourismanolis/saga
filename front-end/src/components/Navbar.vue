<template>
	<div>
		<b-navbar type="dark" variant="secondary" class="my-0 py-0 pt-2">
			<router-link to="/">
				<img src="@/assets/logo.png" id="sagalogo" />
			</router-link>
			<div v-if="isLoggedIn" class="ml-auto">
				<div class="rcorner_top">
					<b-button variant="primary" to="/projects">
						Τα project μου
						<b-icon icon="box-seam"></b-icon>
					</b-button>

					<b-dropdown
						id="dropdown-1"
						text="Dropdown Button"
						class="mx-2 p-0"
						toggle-class="user_button"
						variant="primary"
						no-caret
						right
					>
						<template #button-content>
							<b-icon icon="chevron-left"></b-icon>
							<img
								:src="profile.picture || DEFAULT_PICTURE"
								id="user_image"
							/>
						</template>
						<b-dropdown-item
							class="my-account"
							@click="redirectProfile"
							><i class="bi bi-person mr-1"></i>Ο Λογαριασμός
							μου</b-dropdown-item
						>
						<b-dropdown-item class="log-out" @click="logout"
							><i class="bi bi-box-arrow-in-right mr-1"></i
							>Αποσύνδεση</b-dropdown-item
						>
					</b-dropdown>
				</div>
			</div>
			<div v-else class="rcorner_top ml-auto">
				<b-button variant="primary" to="/login"
					>Σύνδεση / Εγγραφή</b-button
				>
			</div>
		</b-navbar>
		<b-navbar type="dark" variant="primary">
			<div v-for="(crumb, idx) in crumbs" :key="idx">
				<router-link
					v-if="isNaN(crumb.text)"
					:to="crumb.to"
					class="text-light hand"
					>{{ crumb.text }}</router-link
				>
				<span v-else class="text-light"> {{ crumb.text }}</span>
				<span v-if="idx !== crumbs.length - 1" class="mx-1 text-light"
					>/</span
				>
			</div>
		</b-navbar>
	</div>
</template>

<script>
const DEFAULT_PICTURE = require(`@/assets/profile pics/default-profile-pic.png`);

export default {
	name: 'NavBar',
	data() {
		return {
			profile: {},
		};
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
		isLoggedIn() {
			return this.$store.state.isLoggedIn;
		},
		crumbs() {
			let paths = this.$route.path.split('/').filter((p) => p.length > 0);
			return paths.map((p) => {
				// make "to" to be the path up to this point, if the path is
				// /projects/12/backlog/test and p is 'backlog' to will be '/projects/12/backlog'
				let to = '';
				for (let p2 of paths) {
					to += '/' + p2;
					if (p2 === p) break;
				}

				let text = p.charAt(0).toUpperCase() + p.slice(1);
				return {
					text,
					to,
				};
			});
		},
	},
	methods: {
		redirectProfile() {
			this.$router.push({
				path: `/profile`,
			});
		},
		async logout() {
			try {
				await this.$client.logout();
				this.unloadUser();
				location.reload();
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},
		unloadUser() {
			this.$store.commit('setIsLoggedIn', false);
			this.$store.commit('setUser', null);
			localStorage.removeItem('token');
		},
	},
	async created() {
		if (this.isLoggedIn != null) {
			this.profile = await this.$client.getProfile();
		}
	},
};
</script>

<style scoped>
.hand {
	cursor: pointer;
}

b-navbar {
	justify-content: none;
}

.rcorner_top {
	/*display: inline;
	text-align: center;*/
	display: flex;
	align-items: center;
	padding: 10px;
	font-size: 18px;
	color: #e5e5e5;
}
a {
	color: #e5e5e5;
}

#sagalogo {
	bottom: 0;
	margin-left: -10%;
	margin-bottom: -2%;
}

#user_image {
	height: 25px;
	width: auto;
	border-radius: 50px;
}
.b-dropdown-item {
	top: 5px;
}
.dropdown-menu {
	min-width: 10rem;
}

.my-account {
	background-color: #eee9ff;
	color: #564787;
}
</style>
