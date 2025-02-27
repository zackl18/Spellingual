<template>
  <ConfettiExplosion v-if="correct"
:colors="['var(--blue1)', 'var(--red1)', 'var(--green1)', 'var(yellow1)', 'var(--purple1)']" class="confetti" :duration="2000" :stageHeight="350" :stageWidth="350"/>
  
  <div class="modal" :class="{ 'display-show': displayModal, 'display-none': !displayModal }" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div v-if="correct" class="modal-header correct justify-content-center align-items-center">
          <h1 class="modal-title" id="correctModalTitle">Correct!</h1>
        </div>
        <div v-if="!correct" class="modal-header incorrect justify-content-center align-items-center">
          <h1 class="modal-title" id="incorrectModalTitle">Incorrect</h1>
        </div>
        <div class="modal-body">
          <h1 v-if="correct">Great Job!</h1>
          <h1 v-if="!correct">Try Again!</h1>
          <hr class="mt-3 mb-3">
          <hr class="mb-3">
          <hr class="mb-3">
          <hr>
        </div>
        <div class="modal-footer w-100 justify-content-center align-items-center d-grid col-11 col-md-8 col-lg-6">
          <div class="d-flex flex-fill gap-2 w-100">
            <button v-if="correct" type="button" class="btn btn-primary btn-blue btn-lg flex-fill"
              @click.prevent="goToNextLevel">
              Next
            </button>
            <button v-if="!correct" type="button" class="btn btn-primary btn-blue btn-lg flex-fill"
              @click.prevent="closeModal">
              Okay
            </button>
            <button type="button" class="btn btn-secondary btn-red flex-fill"
              @click.prevent="goToLevelSelect">Back</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import ConfettiExplosion from "vue-confetti-explosion";

// Props definition
const { displayModal, correct, goToNextLevel, closeModal, goToLevelSelect } = defineProps([
  'displayModal',
  'correct',
  'goToNextLevel',
  'closeModal',
  'goToLevelSelect',
]);
</script>
  