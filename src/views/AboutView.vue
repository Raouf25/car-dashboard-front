<template>
  <div class="about">
    <h1>This is an about page</h1>

    <div class="flex-container">
    <div class="zone">
      <div class="image-title"><p>Image 1</p></div>
        
        <div
          ref="image1Container"
          class="image-container"
          @mousedown="startDrawing"
          @mousemove="drawRectangle"
          @mouseup="endDrawing"
          @mouseleave="endDrawing"
        >
          <img
            ref="image1"
            :src="image1"
            class="image"
          />
          <div
            v-if="showRectangle"
            class="overlay-rectangle"
            :style="rectangleStyle"
          ></div>
        </div>
      </div>
      <div class="zone">
        <div class="image-title"><p>Image 2</p></div>
        <div 
          class="image-container"  >
        <img
          ref="image2"
          :src="image2"
          class="image"
        />
        </div>

 
      </div>


      <div class="zone">
        <div class="image-title"><p>Extracted Image</p></div>
        
        <div v-if="extractedImage" class="image-container">
          
          <div class="icon-palette">
            <div class="icon">
              <i class="material-icons vertical-arrow ">open_in_full</i>
            </div>
            <div class="icon">
              <i class="material-icons horizontal-arrow">open_in_full</i>
            </div>
            <div class="icon">
              <i class="material-icons">undo</i>
            </div>
            <div class="icon">
              <i class="material-icons">redo</i>
            </div> 
          </div>

          <img   :src="extractedImage" class="image" />
        </div>
      </div>

    </div>
    <button
      @click="validatePhoto"
      class="validate-button"
    >
      Validate Image
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class About extends Vue {
 // public image1 = require('../assets/image1.jpeg');
 // public image2 = require('../assets/image2.jpeg');
 public image1 = require('../assets/left.png');
  public image2 = require('../assets/right.png');
  public startX = 0;
  public startY = 0;
  public endX = 0;
  public endY = 0;
  public showRectangle = false;
  public extractedImage = '';

  get rectangleStyle() {
    const left = Math.min(this.startX, this.endX) + 'px';
    const top = Math.min(this.startY, this.endY) + 'px';
    const width = Math.abs(this.startX - this.endX) + 'px';
    const height = Math.abs(this.startY - this.endY) + 'px';

    return {
      left,
      top,
      width,
      height
    };
  }

  startDrawing(event: MouseEvent) {
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    this.endX = event.offsetX;
    this.endY = event.offsetY;
    this.showRectangle = true;
  }

 drawRectangle(event: MouseEvent) {
    if (!this.showRectangle) return;

    this.endX = event.offsetX;
    this.endY = event.offsetY;
  } 


  endDrawing() {
  this.showRectangle = false;
  console.log('Rectangle coordinates:', this.startX, this.startY, this.endX, this.endY);

  // Extraire l'image2 en utilisant les coordonnées du rectangle
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const image2Element = this.$refs.image2 as HTMLImageElement;
  canvas.width = image2Element.width;
  canvas.height = image2Element.height;
  context?.drawImage(image2Element, 0, 0);

  const extractedData = context?.getImageData(
    Math.min(this.startX, this.endX),
    Math.min(this.startY, this.endY),
    Math.abs(this.startX - this.endX),
    Math.abs(this.startY - this.endY)
  );

  if (extractedData) {
    // Créer une nouvelle image avec les données extraites
    const extractedCanvas = document.createElement('canvas');
    const extractedContext = extractedCanvas.getContext('2d');
    extractedCanvas.width = extractedData.width;
    extractedCanvas.height = extractedData.height;
    extractedContext?.putImageData(extractedData, 0, 0);

    // Convertir le canvas en URL de l'image extraite
    this.extractedImage = extractedCanvas.toDataURL();
  }
}

validatePhoto(): void {
  console.log("photo is validated")
}
}


</script>

<style scoped>
.image {
  width: 100%;
}

.image-container {
  position: relative;
}

.overlay-rectangle {
  position: absolute;
  border: 2px solid #ff0000;
  background-color: transparent;
}

.extracted-image {
  margin-top: 20px;
}
.flex-container {
  display: flex;
  height: 100%;
}

.zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon-palette {
  display: flex;
  justify-content: space-between; 
}

.icon { 
  text-align: center;
}

.icon i {
  font-size: 24px;
  color: #555;
  cursor: pointer;
}

.icon i:hover {
  color: #000;
}

.horizontal-arrow {
  transform: rotate(45deg);
}

.vertical-arrow {
  transform: rotate(-45deg);
}

.image-title {
  margin-bottom: 10px;
}

.validate-button {
  margin-top: 20px;
  display: block;
  margin: 20px auto;
}
</style>