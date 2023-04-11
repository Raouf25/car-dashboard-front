<template>
	<div class="app"  
	v-loading="isLoading"
	element-loading-text="Loading ..." 
    element-loading-background="rgba(0, 0, 0, 0.8)">
		<!-- Sidebar -->
		<side-bar />
		<!-- Content -->
		<div><router-view /></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SideBar from "@/components/SideBar.vue";
import { namespace } from 'vuex-class'
const globalValues = namespace('globalValues')

@Component({
    components: {
      SideBar
    }
})
export default class CarNewPage extends Vue {
	@globalValues.State
	public isLoading!: boolean
}
</script> 

<style lang="scss">
:root {
	--primary: #4ade80;
	--primary-alt: #22c55e;
	--grey: #64748b;
	--dark: #1e293b;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 300px;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira sans', sans-serif;
}

body {
	background: var(--light);
}

button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
}

.app {
	display: flex;

	main {
		flex: 1 1 0;
		padding: 2rem;

		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}
</style>