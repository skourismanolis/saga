<template>
	<div class="flex-column d-flex">
		<ReturnToPage id="back" />
		<div id="form-container" class="align-self-center flex-column d-flex">
			<img id="logo" class="align-self-center" src="../assets/logo.png" />

			<form id="form" class="flex-column d-flex">
				<h4 id="form-header" class="align-self-center">
					Δημιουργήστε τον Λογαριασμό σας
				</h4>
				<a href="#" class="align-self-center">Έχω λογαριασμό</a>

				<div class="form-group">
					<input
						type="email"
						class="form-control"
						id="exampleFormControlInput1"
						placeholder="Email..."
						required
					/>
				</div>

				<div class="form-group">
					<input
						type="text"
						class="form-control"
						id="exampleFormControlInput1"
						placeholder="Επίθετο..."
						required
					/>
				</div>

				<div class="form-group">
					<input
						type="text"
						class="form-control"
						id="exampleFormControlInput1"
						placeholder="Όνομα..."
						required
					/>
				</div>

				<div class="form-group">
					<input
						type="password"
						class="form-control"
						id="exampleInputPassword1"
						placeholder="Κωδικός..."
						required
					/>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import ReturnToPage from '../components/ReturnToPage.vue';

export default {
	components: {
		ReturnToPage,
	},
};
</script>

<style scoped>
#back {
	margin-top: 140px;
	margin-left: 107px;
}

#form-container {
	margin-top: 11px;
}

#logo {
	width: 198px;
}

#form {
	border-radius: 4pt;

	background-color: #fedc97;

	width: 440px;
	height: 446px;

	padding: 48px 60px;

	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

#form-header {
	color: #564787;
	width: 201px;
	text-align: center;
}

#form a {
	color: #db5461;
	font-size: 16;
	margin-bottom: 24px;
}

.form-group {
	height: 50px;
}

.form-group input {
	border-radius: 4pt;
	height: 50px;
}
</style>
