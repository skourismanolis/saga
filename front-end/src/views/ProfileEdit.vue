<template>
	<!-- <div id="background" class="d-flex justify-content-center"></div> -->
	<div id="background" class="d-flex justify-content-center">
		<form>
			<h2 class="form-header">Γενικά</h2>

			<div class="flex-row d-flex">
				<img
					:src="profilePic"
					width="130px"
					height="130px"
					class="rounded-circle align-self-center"
				/>
				<div class="form-group" id="choose-file-container">
					<label for="profile-pic">Αλλαγή εικόνας προφίλ</label>
					<input
						type="file"
						class="form-control-file"
						id="profile-pic"
					/>
				</div>
			</div>
			<div class="form-group text-input">
				<label for="username-input">Όνομα Χρήστη</label>
				<input
					type="text"
					class="form-control"
					id="username-input"
					placeholder="Εισάγεται όνομα χρήστη..."
					v-model="userInfo.username"
					required
				/>
			</div>
			<div class="form-group text-input">
				<label for="name-input">Όνομα</label>
				<input
					type="text"
					class="form-control"
					id="name-input"
					placeholder="Εισάγεται όνομα..."
					v-model="userInfo.name"
					required
				/>
			</div>
			<div class="form-group text-input">
				<label for="surname-input">Επίθετο</label>
				<input
					type="text"
					class="form-control"
					id="surname-input"
					placeholder="Εισάγεται επίθετο..."
					v-model="userInfo.surname"
					required
				/>
			</div>

			<h2 class="form-header">Ασφάλεια</h2>
			<div class="form-group text-input">
				<label for="password-input">Κωδικός</label>
				<input
					type="password"
					class="form-control"
					id="password-input"
					placeholder="Εισάγεται τον κωδικό σας..."
					required
				/>
				<small id="passwordHelp" class="form-text text-muted"
					>Απαιτείται για την αλλαγή στοιχείων λογαριασμού.
				</small>
			</div>

			<div class="d-flex d-flex justify-content-between">
				<div class="d-flex flex-row align-self-center">
					<i class="bi bi-trash link-icon"></i>
					<router-link
						type="submit"
						to="/profile_settings"
						class="align-self-center"
					>
						Διαγραφή λογαριασμού
					</router-link>
				</div>
				<button
					type="submit"
					class="btn d-flex btn-primary align-self-end"
				>
					Αποθήκευση αλλαγών
				</button>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				username: 'Όνομα Χρήστη',
				name: 'Όνομα',
				surname: 'Επίθετο',
				email: 'example@provider.domain',
			},
		};
	},
	computed: {
		profilePic: function () {
			let filename = 'default-profile-pic.png';
			// if (this.user && this.user.ProfilePicPath)
			// 	filename = this.user.ProfilePicPath;
			return require(`../assets/profile pics/${filename}`);
		},
	},
};
</script>

<style scoped>
#background {
	width: 100%;
	height: 100%;

	z-index: -100;

	background-color: white;
	background-image: url('../assets/profile-background.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-attachment: fixed;
}

form {
	height: 780px;
	width: 560px;

	padding: 0px 48px;

	background-color: #fedc97;

	margin-top: 56px;
	margin-bottom: 101px;

	border-radius: 10pt;

	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.form-header {
	color: #564787;
	margin-bottom: 24px;
	margin-top: 36px;
}

#choose-file-container {
	margin-left: 16px;
}

#choose-file-container {
	color: #564787;
	align-self: center;
}

.form-group {
	color: #564787;
	font-size: 18px;
}

.text-input {
	margin-top: 12px;
}

.link-icon {
	color: #db5461;
	font-size: 16;
	margin-right: 8px;
	float: bottom;
}
</style>
