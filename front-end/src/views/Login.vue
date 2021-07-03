<template>
	<div class="flex-column d-flex">
		<ReturnToPage id="back" />

		<div id="form-container" class="align-self-center flex-column d-flex">
			<img id="logo" class="align-self-center" src="../assets/logo.png" />

			<form id="form" class="flex-column d-flex">
				<h4 id="form-header" class="align-self-center">
					Συνδεθείτε στον Λογαριασμό σας
				</h4>

				<div class="form-group">
					<input
						type="email"
						class="form-control"
						id="exampleFormControlInput1"
						placeholder="Email..."
						v-model="loginForm.email"
						required
					/>
				</div>

				<div class="form-group">
					<input
						type="password"
						class="form-control"
						id="exampleInputPassword1"
						placeholder="Κωδικός..."
						v-model="loginForm.password"
						required
					/>
				</div>

				<button
					type="submit"
					class="btn btn-primary align-self-center"
					@click="loginUser"
				>
					Σύνδεση
				</button>

				<div id="line"><hr /></div>

				<div class="d-flex flex-row align-self-center">
					<i class="bi bi-circle-fill"></i>
					<router-link to="#" class="align-self-center">
						Ξέχασα τον κωδικό
					</router-link>
				</div>
				<div class="d-flex flex-row align-self-center">
					<i class="bi bi-circle-fill"></i>
					<router-link to="/register" class="align-self-center">
						Δημιουργία Λογαριασμού</router-link
					>
				</div>
			</form>
		</div>

		<div class="d-flex justify-content-between" id="art-container">
			<img src="../assets/reglog-art-bottom-left.png" />
			<img src="../assets/reglog-art-bottom-right.png" />
		</div>
	</div>
</template>

<script>
import ReturnToPage from '../components/ReturnToPage.vue';

export default {
	components: {
		ReturnToPage,
	},
	data() {
		return {
			loginForm: {
				email: '',
				password: '',
			},
		};
	},

	methods: {
		async loginUser(evt) {
			evt.preventDefault();
			let options = {
				email: this.loginForm.email,
				password: this.loginForm.password,
			};
			try {
				await this.$client.login(options);
			} catch (error) {
				alert(error);
			}
			await this.$root.loadUser();
			this.$router.push('/projects').catch(() => {});
		},
	},
	created() {
		this.$emit('toggle-navbar', false);

		window.scrollTo(0, 0);
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
	margin-bottom: 60px;
}

#logo {
	width: 198px;
}

#form {
	border-radius: 4pt;

	background-color: #fedc97;

	width: 440px;
	height: 547px;

	padding: 48px 60px;

	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

#form-header {
	color: #564787;
	width: 201px;
	text-align: center;
	margin-bottom: 24px;
}

#form button {
	width: 140px;
	margin-top: 48px;
}

.form-group {
	height: 50px;
}

.form-group input {
	border-radius: 4pt;
	height: 50px;
}

#form i {
	color: #db5461;
	font-size: 16;
	margin-right: 8px;
}

hr {
	border: 0;
	clear: both;
	display: block;
	width: 96%;
	background-color: #564787;
	height: 1px;
	margin-top: 72px;
	margin-bottom: 36px;
}
#art-container {
	margin-top: -80px;
}
</style>
