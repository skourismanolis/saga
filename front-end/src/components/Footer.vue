<template>
	<div class="container d-flex flex-fill justify-content-around">
		<div class="d-flex flex-column col">
			<h4 class="col-title align-self-start">Συνδεθείτε με εμάς</h4>
			<div
				class="d-flex flex-row justify-content-center align-self-start"
			>
				<i class="bi bi-linkedin"></i>
				<i class="bi bi-facebook"></i>
				<i class="bi bi-youtube"></i>
				<i class="bi bi-twitter"></i>
			</div>
		</div>
		<div class="d-flex flex-column col">
			<h4 class="col-title align-self-start">Η εταιρία</h4>
			<a class="align-self-start">Ποιοι είμαστε;</a>
			<a class="align-self-start">Η ιδεολογία μας</a>
			<a class="align-self-start">Συνεργάτες</a>
		</div>
		<div class="d-flex flex-column justify-content-start col">
			<h4 class="col-title text-left align-self-start">
				Περισσότερα για το Saga
			</h4>
			<a class="align-self-start">Δυνατότητες</a>
			<a class="align-self-start">Όροι Χρήσης και Προϋποθέσεις</a>
			<a class="align-self-start">Πολιτική Απορρήτου</a>
		</div>
	</div>
</template>

<style scoped>
.container {
	padding: 0 100px;
	height: 261px;
	width: 100%;

	background-color: #31245d;
	color: white;
}

.col {
	padding: 0 30px;
	width: 270px;
}

.col-title {
	margin-top: 69px;
}

a {
	color: white;
	text-decoration: none;
}

a:hover {
	color: white;
	cursor: pointer;
	font-weight: bold;
}

i {
	padding-right: 10px;
	font-size: 39px;
}

i:hover {
	cursor: pointer;
}
</style>
