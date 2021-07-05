<template>
	<div>
		<ul id="team">
			<li v-for="item in printArray" :key="item">
				{{ item }}
			</li>
			<li v-if="members.length > 4">
				<i class="bi bi-three-dots"></i>
			</li>
		</ul>
		<img src="https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png" />
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

<style scoped>
ul {
	list-style: none;
	list-style-type: none;
	overflow: hidden;
}

li {
	display: inline;
	float: left;
	border-radius: 15px;
}

#team {
	display: table;
	margin: 0 auto;
}

#img1 {
	vertical-align: middle;
	border-style: none;
	width: 26px;
	height: auto;
}

#img2 {
	margin-left: -6px;
}
</style>
