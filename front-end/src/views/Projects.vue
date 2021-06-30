<template>
	<div class="view-container d-flex flex-column">
		<div class="mb36">
			<span class="black-text">Τα</span>
			<span class="purple-text">project</span>
			<span class="black-text">μου</span>
		</div>
		<div class="d-flex flex-row buttons-search-container mb36">
			<button
				type="button"
				class="btn btn-primary d-flex align-items-center create-button"
			>
				Δημιουργία
				<i class="bi bi-plus align-self-center"></i>
			</button>
			<div class="input-group search-field">
				<input
					type="text"
					class="form-control"
					placeholder="Αναζήτηση..."
				/>
				<div class="input-group-append">
					<button class="btn btn-primary" type="button">
						<i class="bi bi-search"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.mb36 {
	margin-bottom: 36px;
}

.buttons-search-container {
	height: 38px;
}

.search-field {
	width: 287px;
}

.create-button {
	width: 165px;
	margin-right: 16px;
}

.create-button i {
	font-size: 24px;
}

.view-container {
	margin: 108px 64px;
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
</style>
