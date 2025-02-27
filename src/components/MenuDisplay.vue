<template>
  <!-- Navigation bar -->
  <nav class="navbar navbar-expand-lg">
    <div class="container d-flex justify-content-between">
      <!-- Conditional buttons for menu and back -->
      <button v-if="!ifMenu" class="btn btn-primary btn-blue" @click="goToMenu">Menu</button>
      <button v-if="ifMenu" class="btn btn-primary btn-red" @click="goBack">Back</button>
      <img src="../assets/images/logo.svg" class="logo" @click="goToLanding">
    </div>
  </nav>
</template>

<script setup>
// Import necessary Vue features
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSound } from '@vueuse/sound';
import audioClick from '@/assets/media/click.mp3';

// Initialize router and sound player
const router = useRouter(); // for routing
const { play: playClick } = useSound(audioClick);

// Use ref to track ifMenu
const ifMenu = ref(isMenuRoute(router.currentRoute.value));

// Watch for changes in the route and update ifMenu accordingly
watch(() => router.currentRoute.value.name, (newRouteName) => {
  ifMenu.value = isMenuRoute(newRouteName);
});

/**
 * Checks if the given route name is the 'Menu' route.
 * @param {string} routeName - The name of the route.
 * @returns {boolean} - True if it's the 'Menu' route, false otherwise.
 */
function isMenuRoute(routeName) {
  return routeName === 'Menu';
}

/**
 * Navigates to the 'Menu' route and plays a click sound.
 */
const goToMenu = () => {
  playClick();
  router.push({ name: 'Menu' });
};

/**
 * Returns to the last route in the history and plays a click sound.
 */
const goBack = () => {
  playClick();
  window.history.back();
};

/**
 * Returns to the last route in the history and plays a click sound.
 */
 const goToLanding = () => {
  playClick();
  router.push({ name: 'Landing' });
};
</script>
