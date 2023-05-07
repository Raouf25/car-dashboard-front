<template>
  <div class="about">
    <h1>This is an about page</h1>

    <div style="display: flex">
      <div style="flex: 1">
        <p>Image 1</p>
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
      <div class="drop-zone-divider"></div>
      <div style="flex: 1">
        <p>Image 2</p>
        <img
          ref="image2"
          :src="image2"
          class="image"
        />
        <div v-if="extractedImage" class="extracted-image">
          <p>Extracted Image</p>
          <img :src="extractedImage" class="image" />
        </div>
      </div>
    </div>
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
}


</script>

<style scoped>
.drop-zone-divider {
  width: 2px;
  background-color: #000;
  margin: 0 10px;
  height: 100%;
}

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
</style>