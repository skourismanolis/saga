<template>
	<div v-if="token != null" class="p-5 text-center">
		<h4 class="mb-2">
			Σας έχουν προσκαλέσει σε ενα project, θέλετε να συμμετέχετε;
		</h4>
		<b-btn variant="primary" class="mr-2" @click="applyInvite">Ναι!</b-btn>
		<b-btn to="/projects">Επιστροφή</b-btn>
	</div>
	<div v-else>Άκυρη πρόσκληση :(</div>
</template>
<script>
export default {
	name: 'Invite',
	computed: {
		token() {
			if (this.$route.query == null || this.$route.query.token == null)
				return null;
			else return this.$route.query.token;
		},
	},
	methods: {
		async applyInvite() {
			await this.$client.applyToken({ token: this.token });
			this.$router.push('/projects').catch(() => {});
		},
	},
};
</script>
