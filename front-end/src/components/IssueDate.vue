<template>
	<div
		class="
			d-flex
			flex-row
			align-items-center
			justify-content-center
			ml-auto
			issue-date
		"
	>
		<slot></slot>
	</div>
</template>

<style>
.issue-date {
	background-color: white;
	font-size: 16px;
	color: #047c97;
	padding: 2px 10px;
	border-radius: 12pt;
	border-style: solid;
	border-color: black;
	border-width: 1px;
	margin-right: 6px;
}
</style>
