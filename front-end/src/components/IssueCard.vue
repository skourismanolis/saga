<template>
	<div id="main">
		<b-card-group deck>
			<b-card
				header-tag="header"
				footer-tag="footer"
				style="border-radius: 0px"
			>
				<b-card-text v-b-popover.hover.top="`{{issue.title}}`">
					<h6 style=" float:left">{{ issue.title }}</h6>
					<div id="dets-column" class="footer-element">
						
						<i
							id="issue-icon"
							class="bi bi-bug issue-element"
							v-if="issue.type == 'bug'"
						></i>
						<i
							id="issue-icon"
							class="bi-book issue-element"
							v-else-if="issue.type == 'story'"
						></i>
						<i
							id="issue-icon"
							class="bi bi-bullseye issue-element"
							v-else-if="issue.type == 'task'"
						></i>
						<IssuePriority
							class="issue-element"
							:priority="issue.priority"
						/>
					</div>
				</b-card-text>
				<template #footer style="justify-content: space-between">
					<h6 class="footer-element">[Members here]</h6>
					<div
						id="dets"
						class="footer-element"
						style="display: table"
					>
						<label id="date-label">
							{{ issue.date }}
						</label>
						<label id="id-label"> #{{ issue.id }} </label>
					</div>
				</template>
			</b-card>
		</b-card-group>
	</div>
</template>

<script>
import IssuePriority from './IssuePriority.vue';

export default {
	data() {
		return {
			issue: {
				id: 123,
				date: '23 Μαρ',
				title: 'Task title of some lengthTask title of some length',
				priority: 'Very Low',
				type: 'story',
			},
		};
	},
	components: {
		IssuePriority,
	},
};
</script>

<style scoped>
footer.card-footer {
	border-radius: 0px;
	padding: 0px;
	padding-top: 6px;
	padding-right: 12px;
	background-color: rgb(218, 218, 218);
}

.footer-element {
	vertical-align: middle;
	display: inline;
}

p.card-body {
	display: inline;
}

.card-body{
	padding-right: 12px;
}

#date-label {
	background-color: white;
	border-radius: 50px;
	padding-left: 6px;
	padding-right: 6px;
	margin-right: 6px;
}

#dets {
	float: right;
}

#dets-column {
	float: right;
	flex-direction: column;
	overflow: hidden;
}

i {
	padding-left: 15%;
	padding-top: 0;
	margin-top: 0;
	color:#DB5461;
	width: 24px;
	height: 24px;
}

p.card-text {
	text-overflow: ellipsis;
	white-space: nowrap;
    overflow: hidden;
}

h6{
	width:255.96px;
	text-overflow: ellipsis;
	white-space: nowrap;
    overflow: hidden;
}

#main{
	width: 325px;
}
</style>
