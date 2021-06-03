<template>
	<div id="bar2_breadcrumbs">
		<b-navbar type="dark" variant="dark">
			<b-breadcrumb :items="items"></b-breadcrumb>
		</b-navbar>
	</div>
</template>

<script>
export default {
	data() {
		return {
			items: [
				{
					text: 'Admin',
					href: '#',
				},
				{
					text: 'Manage',
					href: '#',
				},
				{
					text: 'Library',
					active: true,
				},
			],
		};
	},
};
</script>

<style scoped>
b-navbar {
	justify-content: none;
}

.breadcrumb {
	margin-bottom: 0.2rem;
	margin-top: 0rem;
}

#bar2_breadcrumbs {
	margin-top: -4px;
}
</style>
