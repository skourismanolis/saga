<template>
	<form>
		<div class="left d-flex flex-column">
			<div classs="d-flex flex-row title-row">
				<span class="black-text title">Ρυθμίσεις </span>
				<span class="purple-text title">project </span>
			</div>
			<img
				:src="profilePic"
				width="128px"
				height="128px"
				class="rounded-circle"
			/>
			<div class="form-group" id="choose-file-container">
				<label for="profile-pic">Αλλαγή εικόνας...</label>
				<input
					type="file"
					class="form-control-file file-button"
					id="profile-pic"
				/>
			</div>
			<span class="black-text mb12"> Τίτλος Project </span>
			<div class="input-group mb12">
				<input
					type="text"
					class="form-control"
					placeholder="Recipient's username"
					aria-label="Recipient's username"
					aria-describedby="basic-addon2"
				/>
				<div class="input-group-append">
					<button class="btn btn-primary" type="button">
						<i class="bi bi-check-lg"></i>
					</button>
					<button class="btn btn-outline-primary" type="button">
						<i class="bi bi-x-lg"></i>
					</button>
				</div>
			</div>
			<span class="black-text mb12"> Προσκάλεσε τα μέλη της ομάδας </span>
			<div class="input-group mb12">
				<input
					type="emai"
					class="form-control"
					placeholder="Εισάγετε το e-mail του μέλους..."
				/>
				<div class="input-group-append">
					<button class="btn btn-primary" type="button">
						<i class="bi bi-envelope"></i>
					</button>
				</div>
			</div>
			<span class="black-text mb12">
				Ή στείλε τον παρακάτω σύνδεσμο:
			</span>
			<div class="input-group mb60">
				<input
					type="text"
					class="form-control"
					v-model="generatedLink"
					disabled
				/>
				<div class="input-group-append">
					<button class="btn btn-primary" type="button">
						Αντιγραφή
					</button>
				</div>
			</div>
			<button type="button" class="btn btn-danger mb12">
				Διαγραφή Project
			</button>
		</div>
	</form>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {
		profilePic: function () {
			let filename = 'default-profile-pic.png';
			// if (this.user && this.user.ProfilePicPath)
			// 	filename = this.user.ProfilePicPath;
			return require(`../assets/profile pics/${filename}`);
		},
		generatedLink() {
			return 'htttps://invite.com/w=AagYAFa76%A';
		},
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

.mb60 {
	margin-bottom: 60px;
}
</style>
