<template>
	<div v-if="!loaded"><b-spinner /></div>
	<div v-else class="p-4">
		<TeamList class="mb-4 ml-3" :members="[{ username: 'asd' }]" max="10" />
		<div class="d-flex">
			<div class="column rounded-sm todo">
				<h3>TODO</h3>
				<IssueCard
					class="my-2"
					v-for="issue in columnIssues[0].content"
					:key="issue.code"
				/>
			</div>
			<div class="column rounded-sm in-progress">
				<h3>IN PROGRESS</h3>
				<IssueCard
					class="my-2"
					v-for="issue in columnIssues[1].content"
					:key="issue.code"
				/>
			</div>
			<div class="column rounded-sm done">
				<h3>IN PROGRESS</h3>
				<IssueCard
					class="my-2"
					v-for="issue in columnIssues[2].content"
					:key="issue.code"
				/>
			</div>
			<div>
				<a class="hand">
					<span class="bg-gray px-2 py-1 rounded-sm">
						<b-icon icon="search" class="text-white" />
					</span>
					Αναζήτηση
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import IssueCard from '../components/IssueCard.vue';
import TeamList from '../components/TeamList.vue';

export default {
	name: 'Board',
	components: {
		IssueCard,
		TeamList,
	},
	data() {
		return {
			loaded: false,
			project: null,
			members: null,
			columnIssues: [],
		};
	},
	methods: {
		async refreshAllIssues() {
			let columns = await this.project.getColumns();
			this.columnIssues = await Promise.all([
				...columns.map((c) => this.project.searchIssues({ column: c })),
				this.project.searchIssues({ column: null }),
			]);
		},
	},
	async created() {
		try {
			this.project = await this.$client.getProject({
				idProject: this.$route.params.idProject,
			});
			this.members = await this.project.getMembers();
			await this.refreshAllIssues();
			this.loaded = true;
		} catch (error) {
			alert(error);
		}
	},
};
</script>

<style scoped>
a {
	color: initial !important;
	text-decoration: none !important;
}
.hand {
	cursor: pointer;
}
.bg-gray {
	background-color: #aaa;
}
.todo {
	background-color: #fcd57f;
}

.in-progress {
	background-color: #efb0b7;
}

.done {
	background-color: #7b7393;
}
.column {
	width: 350px;
	padding-top: 32px;
	padding-bottom: 16px;
	padding-left: 12px;
	padding-right: 12px;
	margin-left: 12px;
	margin-right: 12px;
	color: white;
}
</style>
