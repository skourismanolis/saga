<template>
	<div>
		<b-navbar type="dark" variant="secondary" class="my-0 py-0 pt-2">
			<router-link to="/">
				<img src="@/assets/logo.png" id="sagalogo" />
			</router-link>
			<div v-if="isLoggedIn" class="ml-auto">
				<div class="rcorner_top">
					<b-button variant="primary">
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
								src="https://1.gravatar.com/avatar/be8819126bd50fa16210bc5dd249beb2?s=360"
								id="user_image"
							/>
						</template>
						<b-dropdown-item>First Action</b-dropdown-item>
						<b-dropdown-item>Second Action</b-dropdown-item>
						<b-dropdown-item>Third Action</b-dropdown-item>
						<b-dropdown-divider></b-dropdown-divider>
						<b-dropdown-item active>Active action</b-dropdown-item>
						<b-dropdown-item disabled
							>Disabled action</b-dropdown-item
						>
					</b-dropdown>
				</div>
			</div>
			<div v-else class="rcorner_top ml-auto">
				<b-button variant="primary">Σύνδεση / Εγγραφή</b-button>
			</div>
		</b-navbar>
		<b-navbar type="dark" variant="primary">
			<router-link
				v-for="(crumb, idx) in crumbs"
				:key="idx"
				class="text-light hand"
				:to="crumb.to"
			>
				{{ crumb.text }}
				<span v-if="idx !== crumbs.length - 1" class="mx-1">/</span>
			</router-link>
		</b-navbar>
	</div>
</template>

<script>
export default {
	name: 'NavBar',
	data() {
		return {
			isLoggedIn: false,
		};
	},
	computed: {
		crumbs() {
			let paths = this.$route.path.split('/');
			return paths
				.filter((p) => p.length > 0)
				.map((p) => {
					return {
						text: p,
						to: p,
					};
				});
		},
	},
};
</script>

<style>
.user_button {
	border-top-right-radius: 50px;
	border-bottom-right-radius: 50px;
	padding-left: 5px;
	padding-right: 3px;
}
</style>

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
</style>
