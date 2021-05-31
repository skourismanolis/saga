<template>
	<div class="d-flex flex-row justify-content-around">
		<div class="card flex-column" @click="redirectRegister">
			<div class="d-flex justify-content-around card-header free">
				<h3>Δωρεάν</h3>
			</div>
			<div class="d-flex flex-column justify-content-start card-content">
				<h4>Περιλαμβάνει</h4>
				<li v-for="point in free_plan_points" :key="point.message">
					{{ point.message }}
				</li>
				<img
					class="align-self-center"
					src="../assets/free-plan-art.png"
				/>
			</div>
		</div>

		<div class="card flex-column" @click="redirectRegister">
			<div class="d-flex justify-content-around card-header normal">
				<h3>Κανονικό</h3>
			</div>
			<div class="d-flex flex-column justify-content-start card-content">
				<h4>Περιλαμβάνει</h4>
				<li v-for="point in normal_plan_points" :key="point.message">
					{{ point.message }}
				</li>
				<img
					class="align-self-center"
					src="../assets/normal-plan-art.png"
				/>
			</div>
		</div>

		<div class="card flex-column" @click="redirectRegister">
			<div class="d-flex justify-content-around card-header premium">
				<h3>Premium</h3>
			</div>
			<div class="card-content flex-column d-flex justify-content-start">
				<h4>Περιλαμβάνει</h4>
				<li v-for="point in premium_plan_points" :key="point.message">
					{{ point.message }}
				</li>
				<img
					class="align-self-center"
					src="../assets/premium-plan-art.png"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		toRegister: Boolean,
	},
	data() {
		return {
			free_plan_points: [
				{ message: 'Orci varius natoque penatibus et magnis.' },
				{ message: 'Etiam in bibendum velit.' },
			],

			normal_plan_points: [
				{ message: 'Orci varius natoque penatibus et magnis.' },
				{ message: 'Etiam in bibendum velit.' },
				{ message: 'Nam quis congue neque.' },
			],

			premium_plan_points: [
				{ message: 'Orci varius natoque penatibus et magnis.' },
				{ message: 'Etiam in bibendum velit.' },
				{ message: 'Nam quis congue neque.' },
				{ message: 'Sed ultrices hendrerit dolor.' },
			],
		};
	},
	methods: {
		redirectRegister() {
			if (this.toRegister == true) {
				this.$router.push({ path: '/register' }).catch(() => {});
			}
		},
	},
};
</script>

<style scoped>
.card {
	border: 0;

	width: 313px;
	height: 449px;

	background-color: #ededed;

	margin: 0 17px;

	padding: 12px;
}

.card:hover {
	cursor: pointer;
	background-color: #fedc97;
}

.free {
	background-color: #d2d2d2;
}

.normal {
	background-color: #564787;
}

.premium {
	background-color: #db5461;
}

.card-header {
	border: 0;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;

	width: 289px;
	height: 77px;
}

.card-header h3 {
	color: white;

	font-weight: bold;
	font-size: 36px;
}

.card-content {
	border: 0;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;

	width: 289px;
	height: 336px;

	background-color: white;

	margin-top: 12px;

	padding-left: 12px;
	padding-top: 12px;
	padding-right: 12px;

	position: relative;
}

.card-content h4 {
	text-decoration: underline;
}

.card-content li {
	margin-left: 12px;
	font-size: 18;
}

.card-content img {
	width: 170px;
	height: 117px;

	position: absolute;
	bottom: 0;
}
</style>
