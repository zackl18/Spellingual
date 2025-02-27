<template>
  <!-- Main application layout -->
  <div>
    <!-- Display the menu component -->
    <MenuDisplay/>

    <!-- Display the router view for dynamic content -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import MenuDisplay from './components/MenuDisplay.vue';
</script>

<style>
@import url('assets/main.css');
</style>
