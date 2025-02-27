<template>
    <!-- Container for the main content -->
    <div class="container">
      <div v-if="persianItems" class="text-center">
        <!-- Component Header -->
        <h1 class="col-12 page-header mt-3 mb-3">Farsi Alphabet</h1>
      </div>
  
      <div class="row d-flex justify-content-center pb-2">
        <div class="col-11 col-md-8 col-lg-6 persian-letters-block d-flex flex-wrap justify-content-center pt-2 pb-2">
          <div v-for="letter in persianItems" :key="letter.key" class="persian-letter flex-fill">
            {{ letter.persian }}<br /><span class="pronunciation">{{ letter.english }}</span>
          </div>
        </div>
      </div>
  
      <!-- Back button -->
      <div class="row justify-content-center mt-3">
        <div class="d-grid col-11 col-md-8 col-lg-6 d-flex mb-4">
          <button
            type="button"
            class="btn btn-secondary btn-lg btn-red flex-fill"
            @click.prevent="goToLevelSelect" >
            Back
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useSound } from "@vueuse/sound";
  import audioClick from "@/assets/media/click.mp3";
  import { initializeAlphabet } from "@/utils/helpers";
  
  const router = useRouter();
  const { play: playClick } = useSound(audioClick);
  
  const persianItems = ref([]);
  
  onMounted(async () => {
    try {
      persianItems.value = await initializeAlphabet();
    } catch (error) {
      // Handle error as needed
      console.error("Failed to initialize alphabet: ", error);
    }
  });
  
  /**
   * Navigates to the LevelSelect component.
   *
   * @returns {void}
   */
  const goToLevelSelect = () => {
    playClick();
    router.push({ name: "LevelSelect" });
  };
  </script>
  