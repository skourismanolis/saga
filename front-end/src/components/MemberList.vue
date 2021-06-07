<template>
	<div>
		<ul id="team">
			<li v-for="item in printArray" :key="item">
				{{ item }}
			</li>
			<li v-if="printArray.length > 4">more</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		members: Array,
	},
	computed: {
		printArray() {
			return this.members.slice(0, 4);
		},
	},
};
</script>

<style>
ul {
	list-style: none;
	list-style-type: none;
}

li {
	display: inline;
	float: left;
}

#team {
	display: table;
	margin: 0 auto;
}
</style>
