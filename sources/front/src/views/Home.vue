<template>
	<div class="flex-column">
		<div class="d-flex flex-row col-element text-section">
			<h3 class="align-self-sm-baseline black-text">Καλωσορίσατε στο</h3>
			<h3 class="align-self-sm-baseline purple-text">Saga!</h3>
		</div>
		<button
			type="button"
			class="btn btn-primary col-element d-flex align-items-center"
			v-on:click="scrollToElement()"
		>
			Ξεκίνα τώρα
			<i class="bi bi-chevron-right align-self-center"></i>
		</button>
		<img id="home-art" src="../assets/home-page-art.png" />
		<div class="d-flex flex-row text-section justify-content-center">
			<h3 class="align-self-sm-baseline black-text">Διάλεξε το</h3>
			<h3 class="align-self-sm-baseline purple-text">πλάνο</h3>
			<h3 class="align-self-sm-baseline black-text">
				που σου ταιριάζει!
			</h3>
		</div>
		<div class="d-flex justify-content-center" id="rate-plans">
			<RatePlans :toRegister="true" @plan-change="redirectRegister" />
		</div>
	</div>
</template>

<script>
import RatePlans from '../components/RatePlans.vue';

export default {
	components: {
		RatePlans,
	},
	methods: {
		scrollToElement() {
			const el = this.$el.querySelector('#rate-plans');

			if (el) {
				// Use el.scrollIntoView() to instantly scroll to the element
				el.scrollIntoView({ behavior: 'smooth' });
			}
		},

		redirectRegister(value) {
			let query = { activePlan: value };
			this.$router
				.push({ path: '/register', query: query })
				.catch(() => {});
		},
	},
	created() {
		window.scrollTo(0, 0);
	},
};
</script>

<style scoped>
.col-element {
	margin-left: 286px;
}

.text-section {
	margin-top: 108px;
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

.bi-chevron-right {
	margin-left: 8px;
	font-size: 24px;
}

#home-art {
	margin-top: 72px;
	margin-left: 0px;
	width: 100%;
}

#rate-plans {
	margin-top: 36px;
	margin-bottom: 88px;
}
</style>
