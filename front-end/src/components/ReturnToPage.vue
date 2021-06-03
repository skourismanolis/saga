<template>
	<div class="flex-row allign-content-center">
		<img
			id="arrow"
			class="align-middle"
			src="../assets/long-arrow-back.png"
		/>
		<router-link to="/" id="link" class="align-middle"
			>Επιστροφή στην αρχική σελίδα</router-link
		>
	</div>
</template>

<style scoped>
#arrow {
	margin-right: 9px;
}

#arrow:hover {
	cursor: pointer;
}

#link {
	font-size: 24px;
}
</style>
