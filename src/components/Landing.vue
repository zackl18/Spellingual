<template>
  <div class="container-fluid landing justify-content-center">
    <div class="landing-row row align-items-center justify-content-center p-0 m-0">
      <div class="col-9 col-md-7 col-lg-6 p-0 m-0 landing-content">
        <!-- Application title -->
        <h1 class="app-title pt-4 pb-4">Spellingual</h1>

        <!-- Game description -->
        <h2 class="p-2">English to Farsi<br>Spelling Game</h2>

        <!-- Repeatable horizontal lines -->
        <hr v-for="n in 5" :key="n" class="mb-3">

        <!-- User input section -->
        <div class="row mx-2 pt-1 pb-1 justify-content-center">
          <!-- Display welcome message if username exists -->
          <div class="col-10 px-3 pt-3 pb-2 mt-3 mb-3 username-box" v-if="ifUsername">
            <h3>Welcome, {{ username }}!</h3>
          </div>

          <!-- Display username input if it doesn't exist -->
          <div class="col-10 px-3 p-3 mx-5 mt-3 mb-3 username-box" v-else>
            <input v-model="username" 
              @blur="updateIfUsername" 
              @keyup.enter="updateIfUsername"
              class="form-control form-control-lg" 
              type="text"
              placeholder="What is your name?" 
              aria-label=".form-control-lg example">
          </div>
        </div>

        <!-- Start/Continue button -->
        <button :disabled="!ifUsername" class="col-10 btn btn-primary btn-green btn-lg mb-4 mt-1"
          @click.prevent="goToLevelSelect">
          <span>{{ ifUsername ? 'Continue' : 'Begin' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSound } from '@vueuse/sound';
import audioClick from '@/assets/media/click.mp3';

const router = useRouter();
const username = ref(localStorage.getItem('username') || '');
const ifUsername = ref(!!username.value);

const { play: playClick } = useSound(audioClick);

// Function to update ifUsername based on the existence of a username
const updateIfUsername = () => {
  ifUsername.value = !!username.value;
  localStorage.setItem('username', username.value);
};

// Function to navigate to the LevelSelect route
const goToLevelSelect = () => {
  playClick();
  router.push({ name: 'LevelSelect' });
};
</script>
