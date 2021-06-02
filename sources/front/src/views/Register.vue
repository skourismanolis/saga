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
						v-model="registerForm.email"
						required
					/>
				</div>

				<div class="form-group">
					<input
						type="text"
						class="form-control"
						id="exampleFormControlInput1"
						placeholder="Επίθετο..."
						v-model="registerForm.surname"
						required
					/>
				</div>

				<div class="form-group">
					<input
						type="text"
						class="form-control"
						id="exampleFormControlInput1"
						placeholder="Όνομα..."
						v-model="registerForm.name"
						required
					/>
				</div>

				<div class="form-group">
					<input
						type="password"
						class="form-control"
						id="exampleInputPassword1"
						placeholder="Κωδικός..."
						v-model="registerForm.password"
						required
					/>
				</div>
			</form>
		</div>

		<div class="d-flex flex-row text-section justify-content-center">
			<h3 class="align-self-sm-baseline black-text">Διάλεξε το</h3>
			<h3 class="align-self-sm-baseline purple-text">πλάνο</h3>
			<h3 class="align-self-sm-baseline black-text">
				που σου ταιριάζει!
			</h3>
		</div>

		<div class="d-flex justify-content-center" id="rate-plans">
			<RatePlans :plan="registerForm.plan" @plan-change="changePlan" />
		</div>

		<div
			id="button-container"
			class="d-flex justify-content-between align-self-center"
		>
			<button type="button" class="btn btn-danger" @click="redirectHome">
				Ακύρωση
			</button>

			<div class="d-flex flex-row">
				<div class="form-check align-middle d-flex align-items-center">
					<input
						class="form-check-input"
						type="checkbox"
						value=""
						id="defaultCheck1"
						v-model="registerForm.terms"
						required
					/>
					<label class="form-check-label" for="defaultCheck1">
						Έχω διαβάσει και αποδέχομαι τους
						<a href="#"> όρους χρήσης </a>
					</label>
				</div>

				<button
					type="button"
					class="btn btn-primary align-middle"
					@click="registerUser"
				>
					Δημιουργία Λογαριασμού
				</button>
			</div>
		</div>
		<div class="d-flex justify-content-between" id="art-container">
			<img src="../assets/reglog-art-bottom-left.png" />
			<img src="../assets/reglog-art-bottom-right.png" />
		</div>
	</div>
</template>

<script>
import ReturnToPage from '../components/ReturnToPage.vue';
import RatePlans from '../components/RatePlans.vue';

export default {
	components: {
		ReturnToPage,
		RatePlans,
	},
	data() {
		return {
			registerForm: {
				email: '',
				surname: '',
				name: '',
				password: '',
				plan: '',
				terms: false,
			},
		};
	},
	methods: {
		redirectHome() {
			this.$router.push({ path: '/' }).catch(() => {});
		},

		changePlan(value) {
			this.registerForm.plan = value;
		},

		async registerUser() {
			try {
				let object = {
					username: null,
					email: this.registerForm.email,
					password: this.registerForm.password,
					name: this.registerForm.name,
					surname: this.registerForm.surname,
					profession: null,
					birthDate: null,
					studies: null,
					residence: null,
					picture: null,
					plan: this.registerForm.plan,
				};
				console.log(object);
				// let response = await this.$axios.post('/users', object);
				// if(re)
				alert('Η δημιουργία λογαριασμού ολοκληρώθηκε με επιτυχία!');
			} catch (error) {
				alert(this.errormessage);
				console.log(error);
			}
		},
	},
	created() {
		window.scrollTo(0, 0);

		if (this.$route.query != null) {
			this.registerForm.plan = this.$route.query.activePlan;
		}
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
	height: 457px;

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

.purple-text {
	margin-left: 10px;
	margin-right: 10px;
	font-weight: bold;
	color: #564787;
	font-size: 48px;
}

.black-text {
	font-weight: bold;
	font-size: 36px;
}

#rate-plans {
	margin-top: 36px;
	margin-bottom: 88px;
}

#button-container {
	width: 1007px;
}

.form-check {
	margin-right: 60px;

	width: 244px;

	text-align: center;
}

.form-check a {
	color: #db5461;
}

.form-check-input {
	margin-right: 16px;
}

#art-container {
	margin-top: 100px;
}
</style>
