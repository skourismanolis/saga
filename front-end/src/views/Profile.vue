<template>
	<div id="background" class="d-flex justify-content-center">
		<div
			class="flex-column d-flex justify-content-center align-items-start"
		>
			<img
				:src="profile.picture || DEFAULT_PICTURE"
				width="130px"
				height="130px"
				class="rounded-circle align-self-center"
			/>

			<div id="profile-container" class="flex-column d-flex">
				<span id="username" class="text-break">
					{{ profile.username }}
				</span>

				<span id="section"> Επικοινωνία: </span>
				<div class="flex-row text-center" id="email-container">
					<i class="bi bi-envelope"></i>
					<span id="email"> {{ profile.email }} </span>
				</div>

				<div id="link-container" class="flex-column d-flex">
					<div class="d-flex flex-row align-self-center">
						<i class="bi bi-credit-card link-icon"></i>
						<router-link to="/payments" class="align-self-center">
							Στοιχεία χρέωσης</router-link
						>
					</div>
					<div class="d-flex flex-row align-self-center">
						<i class="bi bi-gear link-icon"></i>
						<router-link
							to="/profile-edit"
							class="align-self-center"
						>
							Ρυθμίσεις
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const DEFAULT_PICTURE = require(`@/assets/profile pics/default-profile-pic.png`);

export default {
	data() {
		return {
			profile: {},
		};
	},
	computed: {
		DEFAULT_PICTURE() {
			return DEFAULT_PICTURE;
		},
	},
	async created() {
		this.profile = await this.$client.getProfile();
	},
};
</script>

<style scoped>
#background {
	width: 100%;
	height: 758px;

	z-index: -100;

	background-color: white;
	background-image: url('../assets/profile-background.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
}

#profile-container {
	margin-top: 36px;
	margin-bottom: 101px;

	border-radius: 4pt;

	background-color: #fedc97;

	width: 292px;
	height: 335px;

	padding: 24px;

	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

#username {
	color: #564787;
	width: 200x;
	font-size: 28px;
}

#section {
	margin-top: 24px;
	color: #564787;
	font-size: 18px;
}

#email-container {
	color: #564787;
	font-size: 18px;
	width: 244px;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

#link-container {
	margin-top: auto;
}

.link-icon {
	color: #db5461;
	font-size: 16;
	margin-right: 8px;
	float: bottom;
}
</style>
