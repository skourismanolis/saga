<template>
	<div class="sprint-container">
		<div class="d-flex flex-row top justify-content-between">
			<div class="d-flex flex-row align-items-baseline">
				<span
					v-if="editTitle == false"
					class="sprint-title"
					@dblclick="toggleEditTitle()"
				>
					{{ sprint.title }}
				</span>
				<b-form-input
					v-else
					class="title-input"
					type="text"
					v-model="sprint.title"
					required
					@focusout="
						toggleEditTitle();
						$emit('sprint-edited', sprint.id);
					"
				></b-form-input>
				<span id="issues-num">{{ issuesNum }}</span>
			</div>
			<div class="d-flex align-items-baseline flex-row">
				<b-form-datepicker
					class="sprint-date"
					size="sm"
					v-if="active"
					v-model="sprint.start"
					:date-format-options="{
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					}"
					disabled
				></b-form-datepicker>
				<span v-if="active" class="sprint-title"> - </span>
				<b-form-datepicker
					class="sprint-date"
					size="sm"
					v-model="sprint.deadline"
					@input="$emit('sprint-edited', sprint.id)"
					:date-format-options="{
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					}"
				></b-form-datepicker>
				<button
					v-if="active"
					type="button"
					class="
						btn btn-primary
						button
						d-flex
						align-items-center
						button-container
					"
					@click="$emit('deactivate-sprint')"
				>
					Τερματισμός Sprint
					<i class="bi bi-check-circle button-icon"></i>
				</button>
				<button
					v-else-if="other_active"
					type="button"
					class="
						btn btn-primary
						button
						d-flex
						align-items-center
						button-container
					"
					disabled
				>
					Εκκίνηση Sprint
					<i class="bi bi-play-circle button-icon"></i>
				</button>
				<button
					v-else-if="no_active"
					type="button"
					class="
						btn btn-primary
						button
						d-flex
						align-items-center
						button-container
					"
					@click="$emit('activate-sprint', sprint.id)"
				>
					Εκκίνηση Sprint
					<i class="bi bi-play-circle button-icon"></i>
				</button>
			</div>
		</div>
		<slot></slot>
		<div
			v-if="issuesNum == 0"
			class="empty-msg d-flex justify-content-center"
		>
			<span> Δεν υπάρχουν issues! </span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		active: Boolean,
		other_active: Boolean,
		no_active: Boolean,
		sprint: Object,
		issuesNum: Number,
	},
	data() {
		return {
			editTitle: false,
		};
	},
	methods: {
		toggleEditTitle() {
			if (this.editTitle == false) {
				this.editTitle = true;
			} else {
				this.editTitle = false;
			}
		},
	},
};
</script>

<style scoped>
.sprint-container {
	padding: 12px;
	background-color: #ffd580;
	border-radius: 4pt;
}

.top {
	margin-bottom: 12px;
}

.sprint-title {
	font-size: 24px;
	font-weight: bold;
	color: white;
	max-width: 286px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.title-input {
	/* background: none; */
	height: 36px;
	border: 0;
	padding: 6px;
	font-size: 24px;
	font-weight: bold;
}

#issues-num {
	color: #808080;
	font-size: 24px;
	margin-left: 12px;
}

.empty-msg {
	background-color: white;
	padding: 12px;
}

.button-container {
	height: 36px;
	padding: 12px;
}

.button-icon {
	font-size: 24px;
	margin-left: 6px;
}

.sprint-date {
	width: 120px;
	margin: 0px 8px;
}
</style>
