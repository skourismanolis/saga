<template>
	<b-card
		header-tag="header"
		footer-tag="footer"
		class="rounded-sm card-width text-dark card-border"
		:style="borderColorStyle"
	>
		<b-card-text v-b-popover.hover.top="issue.title" class="d-flex">
			<h6 class="flex=fill">{{ issue.title }}</h6>
			<div>
				<IssueCategory :category="issue.category" />
				<IssuePriority
					class="issue-element"
					:priority="issue.priority"
				/>
			</div>
		</b-card-text>
		<template #footer>
			<div class="d-flex position-relative align-items-center mb-2">
				<div class="assigne-box">
					<TeamList :max="3" :members="assignees" size="42px" />
				</div>
				<div class="ml-auto"></div>
				<IssueDate v-if="issue.deadline != null">
					{{ issue.deadline.toDateString().slice(0, -4) }}
				</IssueDate>
				<span class="id-label font-weight-bold"> #{{ issue.id }} </span>
			</div>
		</template>
	</b-card>
</template>

<script>
import IssuePriority from './IssuePriority.vue';
import TeamList from './TeamList.vue';
import IssueDate from './IssueDate.vue';
import IssueCategory from './IssueCategory.vue';

export default {
	components: {
		IssuePriority,
		TeamList,
		IssueDate,
		IssueCategory,
	},
	props: {
		issue: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			assignees: [],
			label: null,
		};
	},
	computed: {
		borderColorStyle() {
			if (this.label != null) return 'border-color: ' + this.label.color;
			else return '';
		},
	},
	async created() {
		try {
			this.assignees = await this.issue.getAssignees();
			this.label = await this.issue.getLabel();
		} catch (error) {
			alert(error);
		}
	},
};
</script>

<style scoped>
.card-border {
	border: none;
	border-left-style: solid;
	border-left-width: 5px;
	border-color: #444;
}

.assigne-box {
	position: absolute;
	width: 100%;
	/* top: -15px; */
	left: 5px;
}
footer.card-footer {
	border-radius: 0px;
	padding: 0px;
	padding-top: 6px;
	padding-right: 12px;
	background-color: rgb(218, 218, 218);
}

p.card-body {
	display: inline;
}

.card-body {
	padding-right: 12px;
}

.date-label {
	background-color: white;
	border-radius: 50px;
	padding-left: 6px;
	padding-right: 6px;
	margin-right: 6px;
}

i {
	padding-top: 0;
	margin-top: 0;
	color: #db5461;
	width: 24px;
	height: 24px;
}

p.card-text {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

h6 {
	width: 255.96px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	line-height: 1.5em;
	height: 3em;
}

.card-width {
	width: 325px;
}
</style>
