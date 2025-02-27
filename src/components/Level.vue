<template>
  <!-- Container for the main content -->
  <div class="container">
    <!-- LevelModal component -->
    <LevelModal :displayModal="displayLevelModal" :correct="correct" :goToNextLevel="goToNextLevel"
      :closeModal="closeLevelModal" :goToLevelSelect="goToLevelSelect" />
    <!-- HintModal component -->
    <HintModal :displayModal="displayHintModal" :closeModal="closeHintModal" :openModal="showHintModal" />

    <!-- Main content: Level information and word display -->
    <div v-if="word" class="text-center">
      <!-- Level Header -->
      <h1 class="col-12 page-header mt-3 mb-3">Level {{ store.state.levelIndex  + 1}}</h1>

      <div class="row text-center justify-content-center">
        <div class="col-11 col-md-10 col-lg-6 d-flex justify-content-between mb-4 align-middle">
          <h2 class="level-points">{{ store.state.totalPoints }} Points</h2>
          <div class="d-flex">
            <button class="btn btn-orange btn-hint-speech mx-3 btn-fixed-height" v-if="word.hints[1] === 1"><img 
                class="img-hint-speech" @click.prevent="playAudioHint" src="https://crb5399capstoneprojectresources.s3.us-east-2.amazonaws.com/audio-icon.svg"></button>
            <button type="button" class="btn btn-secondary btn-lg btn-blue btn-fixed-height" @click.prevent="showHintModal">
              Hint
            </button>
          </div>
        </div>
      </div>

      <!-- English Word Block -->
      <div class="row text-center justify-content-center">
        <div class="col-11 col-md-10 col-lg-6 english-word-block pt-2 b-2">
          {{ word.english }}
          <br />
          <hr />
          <!-- Display the definition hint if "define the word" hint is purchased -->
          <div v-if="word.hints[0] === 1" class="font-sm">
            {{ word.definition }}
          </div>
          <hr v-if="store.state.dictionary[store.state.levelIndex].hints[0] === 1" />
        </div>
      </div>

      <!-- Guess Word Block -->
      <div class="row text-center justify-content-center">
        <div class="col-11 col-md-10 col-lg-6 d-flex justify-content-center guess-word-block pt-2 pb-3">
          <div v-for="(letter, index) in guess" :key="index" class="letter-block flex-fill" :class="{
            'visible-hide': letter === undefined,
            'visible-show': letter !== undefined,
          }" @click.prevent="moveLetter(index, 'to-available', false)">
            <span class="fixed-height"></span>{{ letter }}
          </div>
          <span class="letter-block transparent">ر</span>
        </div>
      </div>

      <!-- Available Letters Block -->
      <div class="row text-center justify-content-center pt-2 pb-2 mt-4">
        <div class="col-11 col-md-8 col-lg-6 d-flex flex-wrap justify-content-center available-letters-block pt-2 pb-2">
          <div v-for="(letter, index) in available" :key="index" class="letter-block" :class="{
            'visible-hide': letter === undefined,
            'visible-show': letter !== undefined,
            'hint-block': store.state.dictionary[store.state.levelIndex].hints[2] === 1
          }" @click.prevent="moveLetter(index, 'to-guess', false)">
            {{ letter }}
            <span v-if="store.state.dictionary[store.state.levelIndex].hints[2] === 1" class="hint-block-span">
              <br>{{ getAlphabetLetter(letter) }}</span>
          </div>
          <span class="letter-block transparent">ر</span>
        </div>
      </div>
    </div>

    <!-- Button group for Check and Back buttons -->
    <div class="row justify-content-center mt-3">
      <div class="d-grid col-11 col-md-8 col-lg-6">
        <div class="d-flex flex-fill gap-2">
          <button type="button" class="btn btn-lg btn-green flex-fill" @click.prevent="checkGuess">
            Check
          </button>
          <button type="button" class="btn btn-lg btn-purple flex-fill" @click.prevent="resetGuess(true)">
            Reset
          </button>
          <button type="button" class="btn btn-lg btn-red flex-fill" @click.prevent="goToLevelSelect">
            Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import store from '@/store';
import { useRouter } from "vue-router";
import LevelModal from "./LevelModal.vue";
import HintModal from "./HintModal.vue";
import { useSound } from "@vueuse/sound";
import audioClick from "@/assets/media/click.mp3";

const router = useRouter();
const dictionary = ref([]);
let word = ref(null);
let guess = ref([]);
let available = ref([]);

let correct = ref(false);
const displayLevelModal = ref(false);
const displayHintModal = ref(false);

const { play: playClick } = useSound(audioClick);
const audioMappings = ref({}); // To store audio mappings
const audioCorrect = "https://crb5399capstoneprojectresources.s3.us-east-2.amazonaws.com/correct.mp3";
const audioIncorrect = "https://crb5399capstoneprojectresources.s3.us-east-2.amazonaws.com/incorrect.mp3";
const { play: playCorrect } = useSound(audioCorrect);
const { play: playIncorrect } = useSound(audioIncorrect);

async function fetchAudioMappings() {
  try {
    const response = await fetch('/audio.json'); // Adjust the path if necessary
    if (response.ok) {
      audioMappings.value = await response.json();
    } else {
      console.error('Failed to load audio mappings.');
    }
  } catch (error) {
    console.error('Error fetching audio mappings:', error);
  }
}

onMounted(async () => {
  await fetchAudioMappings();
  
  try {
    const storedDataDict = store.state.dictionary;

    if (storedDataDict && storedDataDict.length > 0) {
      dictionary.value = storedDataDict;
    } else {
      const storedDataDictLocalStorage = localStorage.getItem("dictionary");

      if (storedDataDictLocalStorage) {
        dictionary.value = JSON.parse(storedDataDictLocalStorage);
        store.commit('setDictionary', dictionary.value);
      } else {
        const response = await fetch("./dictionary.json");
        const data = await response.json();
        dictionary.value = data.map((entry) => ({ ...entry, farsi: reverseSplit(entry.farsi) }));
        store.commit('setDictionary', dictionary.value);
        localStorage.setItem("dictionary", JSON.stringify(dictionary.value));
      }
    }

    initializeWord();
  } catch (error) {
    console.error("Error occurred while loading data:", error);
  }
});

function initializeWord() {
  word.value = dictionary.value[store.state.levelIndex];
  available.value = [...word.value.farsi];
  shuffleArray(available.value);
  guess.value = [...word.value.farsi].map(() => undefined);
}

function shuffleArray(array) {
  for (let i = 0; i < array.length; i++) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }
}

const showHintModal = () => {
  playClick();
  displayHintModal.value = true;
};

const goToLevelSelect = () => {
  playClick();
  router.push({ name: "LevelSelect" });
};

function moveLetter(index, type, ifReset) {
  if (!ifReset)
    playClick();

  let temp = "";
  let emptyAvailable = available.value.indexOf(undefined);
  let emptyGuess = guess.value.lastIndexOf(undefined);
  if (type === "to-guess") {
    temp = available.value[index];
    available.value[index] = undefined;
    guess.value[emptyGuess] = temp;
  } else if (type === "to-available") {
    temp = guess.value[index];
    guess.value[index] = undefined;
    available.value[emptyAvailable] = temp;
  } else {
    throw new TypeError("Invalid move type. Use 'to-guess' or 'to-available'.");
  }
}

const closeHintModal = () => {
  playClick();
  displayHintModal.value = false;
};

const closeLevelModal = () => {
  playClick();
  displayLevelModal.value = false;
  if (correct.value)
    goToLevelSelect();
};

function checkGuess() {
  for (let i = 0; i < word.value.farsi.length; i++) {
    if (word.value.farsi[i] !== guess.value[i]) {
      playIncorrect();
      displayLevelModal.value = true;
      store.commit('setStreak', 0);
      resetGuess(false);
      return;
    }
  }

  if (store.state.levelIndex === store.state.levelProgress)
    updateProgress();
  else if (store.state.levelProgress > store.state.levelIndex)
    store.commit('setTotalPoints', store.state.totalPoints + 20);

  playCorrect();
  correct.value = true;
  displayLevelModal.value = true;
}

function updateProgress(percent) {
  store.commit('setTotalPoints', store.state.totalPoints + 50 + store.state.streak * 10);
  store.commit('setLevelProgress', store.state.levelProgress + 1);
  store.commit('setStreak', store.state.streak + 1);
}

function getAlphabetLetter(farsiLetter) {
  const alphabet = JSON.parse(localStorage.getItem('alphabet'));
  for (let i = 0; i < alphabet.length; i++) {
    if (alphabet[i].persian === farsiLetter) {
      return alphabet[i].english;
    }
  }
  return "NA";
}

function resetGuess(playSound) {
  if (!Array.isArray(guess.value) || !Array.isArray(available.value))
    throw new TypeError("Invalid guess or available array.");

  if (playSound)
    playClick();

  for (let i = 0; i < guess.value.length; i++)
    if (guess.value[i] !== undefined)
      moveLetter(i, "to-available", true);
}

// Go to next level
const goToNextLevel = () => {
  store.commit('setLevelIndex', store.state.levelIndex + 1);
  playClick();

  if (store.state.levelIndex < dictionary.value.length)
    initializeWord();
  else
    router.push({ name: "LevelSelect" });

  displayLevelModal.value = false;
  correct.value = false;
};

function playAudioHint() {
  const currentWord = word.value.english; // Assuming `word.value` has an `english` property
  const audioUrl = audioMappings.value.find((mapping) => mapping.word === currentWord)?.audio;
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  } else {
    playClick(); // Fallback to playClick() if the audio URL is not found
  }
}

</script>