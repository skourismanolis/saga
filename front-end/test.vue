<template>
	<div class="hello">
		<h2>count: {{ count }}</h2>
		<h2>{{ total }}€</h2>
		<b-btn v-on:click="add">addme</b-btn>
		<div v-for="(t, idx) in only4" :key="idx">{{ t.price }}€</div>
		<div v-if="tick.length > 4">greater than 4</div>
	</div>
</template>

<script>
export default {
	name: 'HelloWorld',
	props: {
		msg: String,
	},
	data() {
		return {
			asd: '23433',
			tick: [],
		};
	},
	computed: {
		only4() {
			return this.tick.slice(0, 4);
		},
		total() {
			let s = 0;
			this.tick.forEach((t) => {
				s += t.price;
			});
			return s;
		},
		count() {
			return this.tick.length;
		},
	},
	methods: {
		add() {
			this.tick.push({ price: Math.random() * 10 });
		},
	},
};
</script>
