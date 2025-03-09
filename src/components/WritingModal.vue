<template>
    <div class="modal" :class="{ 'display-show': displayModal, 'display-none': !displayModal }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header correct justify-content-center align-items-center">
            <h1 class="modal-title" id="correctModalTitle">Writing Practice</h1>
          </div>
          <div class="modal-body">
            <canvas ref="myCanvas" style="border: 2px solid black; border-radius: 25px;">
                
            </canvas>
          </div>
          <div class="modal-footer w-100 justify-content-center align-items-center d-grid col-11 col-md-8 col-lg-6">
            <div class="d-flex flex-fill gap-2 w-100">
              <button type="button" class="btn btn-primary btn-blue btn-lg flex-fill"
                @click.prevent="goToNextLevel">
                Next
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
  import { ref, onMounted } from 'vue';
  
  // Props definition
  const { displayModal, goToNextLevel, goToLevelSelect } = defineProps([
    'displayModal',
    'goToNextLevel',
    'goToLevelSelect',
  ]);


  // Get a reference to the canvas element
  const myCanvas = ref(null);
  onMounted(() => {
    if (myCanvas.value) { // Ensure myCanvas is not null
      const ctx = myCanvas.value.getContext('2d');
      if (ctx) {
        // Create a new Image object
        const img = new Image();
        img.src = "../../assets/images/clockFarsi.png"; // Set the image source
        // Once the image is loaded, draw it to the canvas
        img.onload = () => {
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // This will stretch the image to fit the canvas
        };
      }
    }
  });


  </script>