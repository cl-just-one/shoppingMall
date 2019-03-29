<template>
	<div>
		<div @click="increment">+</div>
		<div @click="decrement">-</div>
		<div>{{num}}</div>
	</div>
</template>

<script>
export default {
	props: ['num'],
	methods: {
		increment() {
			this.$emit('add')
		},
		decrement() {
			this.$emit('reduce')
		}
	}
}
</script>

<style scoped>

</style>
