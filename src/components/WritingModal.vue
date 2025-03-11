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
              <button type="button" class="btn btn-primary btn-blue btn-lg flex-fill"
                @click="clearCanvas">
                Clear
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
  let isDrawing = false; // Track if the user is drawing
  let ctx = null;

  let image = new Image(); // Create an Image object

  // Set your image source (this could be a URL or a local image path)
  image.src = 'C:\Users\zslew\Spellingual\Spellingual\src\assets\images\clockFarsi.png'; // Replace with your image path

  // Draw the background image
  const drawBackground = () => {
    if (ctx) {
      const width = myCanvas.width;
      const height = myCanvas.height;
      ctx.drawImage(image,0,0,width,height);
    }
  };


  // Clear the canvas
  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      //drawBackground(); // Redraw the background after clearing the canvas
    }
  };

  // Start drawing
  const startDrawing = (e) => {
    isDrawing = true;
    const { offsetX, offsetY } = e; // Get mouse position relative to canvas
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY); // Start path at the mouse position
  };

  // Draw while mouse is moving
  const draw = (e) => {
    if (!isDrawing) return;
      const { offsetX, offsetY } = e;
      ctx.lineTo(offsetX, offsetY); // Draw line to the new mouse position
      ctx.stroke(); // Apply the drawing action 
  };

  // Stop drawing
  const stopDrawing = () => {
    isDrawing = false;
  };

  // Setup the canvas after the component is mounted
  onMounted(() => {
    ctx = myCanvas.value.getContext('2d');
    ctx.lineWidth = 2; // Set line width
    ctx.lineCap = 'round'; // Make the stroke rounded
    ctx.strokeStyle = 'black'; // Set the color of the stroke

    // Once the image is loaded, set it as the background
    image.onload = () => {
      drawBackground(); // Draw the image as the background when it's loaded
    };

    // Attach event listeners to the canvas
    myCanvas.value.addEventListener('mousedown', startDrawing);
    myCanvas.value.addEventListener('mousemove', draw);
    myCanvas.value.addEventListener('mouseup', stopDrawing);
    myCanvas.value.addEventListener('mouseout', stopDrawing);
  });


  </script>