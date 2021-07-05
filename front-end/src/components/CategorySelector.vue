<template>
	<div data-toggle="button" style="flex-direction: column; width: 200px">
		<div v-for="label in labels" :key="label.text" style="border-radius: 0">
			<a
				class="list-item d-flex align-items-center rounded-sm"
				:class="{ selected: value === label }"
				@click="emitInput(label)"
			>
				<span
					class="color-box mr-2 rounded-sm"
					:style="'background-color:' + label.color"
				></span>
				{{ label.name }}
			</a>
		</div>
		<a
			class="list-item d-flex align-items-center rounded-sm"
			@click="addTag"
		>
			<span
				class="
					color-box
					mr-2
					rounded-sm
					border
					d-inline-flex
					justify-content-center
					align-items-center
				"
				>+</span
			>
			Νέο Label</a
		>
	</div>
</template>

<script>
export default {
	props: {
		labels: {
			type: Array,
			required: true,
		},
		value: {
			type: [Object, null],
		},
	},
	data() {
		return {
			colors: ['orange', 'darkred', 'purple', 'black', 'darkblue'],
			selected: 'null',
			// labels: [
			// 	{ text: 'Front-end', value: 'first', color: 'yellow' },
			// 	{ text: 'Back-end', value: 'second', color: 'red' },
			// 	{ text: 'Design', value: 'third', color: 'purple' },
			// 	{ text: 'API Client', value: 'fourth', color: 'black' },
			// 	{ text: 'Kalimba', value: 'fifth', color: 'blue' },
			// ],
			new: { text: '', value: '', color: '' },
		};
	},
	computed: {
		/*colors(){
      let i=0;
      for (i;i<this.options.length;i++){
        this.colors.push(this.options[i].color);
      }
    }*/
	},
	methods: {
		emitInput(label) {
			if (label === this.value) this.$emit('input', null);
			else this.$emit('input', label);
		},
		getTagStyle(index) {
			return (
				//" background-color:" +
				//border: 5px solid red;
				' border-left: 12px solid ' + this.colors[index] + ';'
			);
		},
		addTag() {
			this.selected = true;
		},
	},
};
</script>

<style scoped>
a {
	color: initial;
	cursor: pointer;
}

a:hover {
	color: initial;
	text-decoration: none;
}
.color-box {
	display: inline-block;
	width: 35px;
	height: 35px;
}
.selected {
	background: lavender;
	/* border-color:  */
}

.list-item {
	margin-top: 5px;
}
label.btn {
	display: inline-block;
	line-height: 1.25;
	color: rgb(54, 54, 54);
	text-align: left;
	text-decoration: none;
	vertical-align: middle;
	cursor: pointer;
	font-weight: 500;
	transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
		border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	padding-left: 0px;
	word-wrap: break-word;
	width: 150px;
}

.btn:hover {
	/*border-bottom: 6px solid black;*/
	background-color: rgb(97, 97, 97);
}
label.btn:hover {
	color: rgb(255, 255, 255);
}
</style>
