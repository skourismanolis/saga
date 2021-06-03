<template>
	<div>
		<b-navbar>
			<img src="@/assets/logo.png" id="sagalogo" alt="" />
			<div id="rcorner_top">
				<b-button href="#">
					Τα project μου
					<b-icon icon="box-seam"></b-icon>
				</b-button>
				<b-button
					id="user_button"
					text="Dropdown Button"
					class="m-md-2"
				>
					<b-icon icon="chevron-left"></b-icon>
					<img src="@/assets/logo.png" id="user_image" alt="" />
				</b-button>
				<b-dropdown
					id="dropdown-1"
					text="Dropdown Button"
					class="m-md-2"
				>
					<b-dropdown-item>First Action</b-dropdown-item>
					<b-dropdown-item>Second Action</b-dropdown-item>
					<b-dropdown-item>Third Action</b-dropdown-item>
					<b-dropdown-divider></b-dropdown-divider>
					<b-dropdown-item active>Active action</b-dropdown-item>
					<b-dropdown-item disabled>Disabled action</b-dropdown-item>
				</b-dropdown>
			</div>
			<b-nav-item-dropdown id="nav7_ddown" text="Dropdown" right>
				<b-dropdown-item>one</b-dropdown-item>
				<b-dropdown-item>two</b-dropdown-item>
				<b-dropdown-divider></b-dropdown-divider>
				<b-dropdown-item>three</b-dropdown-item>
			</b-nav-item-dropdown>
		</b-navbar>
	</div>
</template>

<script>
export default {
	name: 'NavBar',
};
</script>

<style scoped>
b-navbar {
	justify-content: none;
}

#rcorner_top {
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

.navbar-expand {
	justify-content: space-between;
	margin: 0;
	padding-bottom: 0;
}

#user_button {
	border-top-right-radius: 50px;
	border-bottom-right-radius: 50px;
}

.btn {
	margin: 5px;
}
#user_image {
	height: 15px;
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
