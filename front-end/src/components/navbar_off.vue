<template>
	<div>
		<b-navbar>
			<img src="@/assets/logo.png" id="sagalogo" alt="" />
			<div class="rcorner_top">
				<div>
					<b-button href="#">Σύνδεση / Εγγραφή</b-button>
				</div>
			</div>
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

.navbar-expand {
	justify-content: space-between;
	margin: 0;
	padding-bottom: 0;
}
</style>
