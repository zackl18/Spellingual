<template>
  <div class="container">
    <!-- Page Header -->
    <div class="row mt-3 mb-0">
      <h1 class="page-header">Level Select</h1>
    </div>

    <!-- Display Points -->
    <PointDisplay />

    <!-- Level Buttons -->
    <div class="row text-center justify-content-center">
      <div class="col-11 col-md-8 col-lg-6 justify-content-center">
        <hr class="level-select-hr" />
      </div>
    </div>
    <div class="row text-center justify-content-center">
      <div class="col-11 col-md-10 col-lg-6 d-flex flex-wrap justify-content-center pt-2">
        <button class="level-block alphabet-block flex-fill mt-1 mb-3 mx-2" @click="goToAlphabet()">
          Farsi Alphabet
        </button>
      </div>
    </div>
    <div class="row text-center justify-content-center">
      <div class="col-11 col-md-10 col-lg-6 d-flex flex-wrap justify-content-center pb-2">
        <button v-for="(term, index) in dictionary" 
          :key="index" 
          :disabled="isLevelDisabled(index)" 
          class="level-block flex-fill mt-1 mb-3 mx-2"
          :class="[levelCategoryClass(index), levelCompleteClass(index), { 'spread-last': index === dictionary.length - 1 }]" 
          @click="goToLevel(index)">
          {{ index + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import PointDisplay from "./PointDisplay.vue";
import { useSound } from "@vueuse/sound";
import audioClick from "@/assets/media/click.mp3";
import store from '@/store';

const dictionary = ref([]); // to store list of words
const router = useRouter(); // for routing
const { play: playClick } = useSound(audioClick);

// Fetch data from localStorage on component mount
onMounted(() => {
  const storedDict = localStorage.getItem("dictionary");

  // Parse and set dictionary and level progress values
  if (storedDict) {
    try {
      dictionary.value = JSON.parse(storedDict);
    } catch (error) {
      console.error("Error parsing JSON data from localStorage:", error);
    }
  }
});

/**
 * Assigns colors to level buttons based on difficulty.
 * @param {number} index - Index of the level in the dictionary.
 * @returns {string} CSS class representing the level difficulty.
 */
const levelCategoryClass = (index) => {
  const category = dictionary.value[index].category;
  switch (category) {
    case "body parts":
      return "green-level";
    case "activities":
      return "purple-level";
    case "objects":
      return "orange-level";
    case "animals":
      return "blue-level";
    case "food":
      return "red-level";
    default:
      return "blue-level";
  }
};

const levelCompleteClass = (index) => {
  return index < store.state.levelProgress ? "completed-level" : "current-level";
};

/**
 * Navigates to a specific level when the level button is clicked.
 * Plays a sound effect on button click.
 * @param {number} levelIndex - Index of the level to navigate to.
 */
const goToLevel = (index) => {
  playClick();
  store.commit('setLevelIndex', index)
  router.push({ name: `Level ${index}` });
};

/**
 * Navigates to the Persian laphabet when the alphabet button is clicked.
 * Plays a sound effect on button click.
 */
const goToAlphabet = () => {
  playClick();
  router.push({ name: "Alphabet" });
};

/**
 * Checks if a level is disabled based on the player's progress.
 * @param {number} index - Index of the level in the dictionary.
 * @returns {boolean} True if the level is disabled, false otherwise.
 */
const isLevelDisabled = (index) => {
  return store.state.levelProgress < index;
};
</script>
