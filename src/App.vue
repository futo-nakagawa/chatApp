<template>
  <div id="app">
    <router-view />
    <NavBar v-if="showNav" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
const route = useRoute()
const showNav = computed(() => route.path !== '/')
</script>

