<template>
	<div class="flex-column">
		<div id="welcome-message" class="d-flex flex-row col-element">
			<h3 id="welcome-text" class="align-self-sm-baseline">
				Καλωσορίσατε στο
			</h3>
			<h3 id="saga-text" class="align-self-sm-baseline">Saga!</h3>
		</div>
		<button type="button" class="btn btn-primary col-element">
			Ξεκίνα τώρα
			<i class="bi bi-chevron-right align-self-center"></i>
		</button>
		<img id="home-art" src="../assets/home-page-art.png" />
	</div>
</template>

<script></script>

<style scoped>
.col-element {
	margin-left: 286px;
}

#welcome-message {
	margin-top: 108px;
}

#saga-text {
	margin-left: 10px;
	font-weight: bold;
	color: #564787;
	font-size: 48px;
}

#welcome-text {
	font-weight: bold;
	font-size: 36px;
}

.bi-chevron-right {
	font-size: 24px;
}

#home-art {
	margin-top: 72px;
	margin-left: 0px;
	width: 100%;
}
</style>
