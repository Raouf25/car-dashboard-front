<template>
   <div class="container">
      <div v-if="!showResultSection">
         <h1>1. Uploader des images</h1>
         <div class="drop-zone-container">
            <drop-zone
               label="Zone de dépôt 1"
               :uploaded-image="uploadedImage1"
               @imageDropped="handleImageDropped(1, $event)"
               ></drop-zone>
            <div class="drop-zone-divider"></div>
            <drop-zone
               label="Zone de dépôt 2"
               :uploaded-image="uploadedImage2"
               @imageDropped="handleImageDropped(2, $event)"
               ></drop-zone>
         </div>
         <button
            @click="startAlgorithm"
            :disabled="!isButtonActive"
            class="start-button"
            >
         Start Analyse
         </button>
      </div>




      <div v-if="showResultSection">
         <h1 >2. Result :</h1>

         <!--div style="display: flex">
            <div style="flex: 1">
               <p>Image 1</p>
               <img :src="processedImage1" :alt="'Processed ' + uploadedImage1?.name"  />
            </div>
            <div class="drop-zone-divider"></div>
            <div style="flex: 1">
               <p>Image 2</p>
               <img :src="processedImage2"  :alt="'Processed ' + uploadedImage2?.name" />
            </div>
         </div-->
         <div class="about">
          

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
            :src="processedImage1"
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
          :src="processedImage2"
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
  </div>








         <div class="buttons-container">
               <button
                  @click="goToPreviousStep"
                  
                  class="second-step-button previous-button"
                  >
               Previous
               </button>
               <button
                  @click="goToPreviousStep" 
                  class="second-step-button submit-button"
                  >
               Submit
               </button>
            </div>
      </div>




   </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";  
import DropZone from "@/components/DropZone.vue";
import { Point } from "@/dtos/Point";
import { UploadedImage } from "@/dtos/UploadedImage";
import { Getter, Mutation, Action } from "vuex-class";


@Component({
      components: {
        DropZone
      }
  })
export default class UploadImagesComponent extends Vue {
  public uploadedImage1: UploadedImage | null = null;
  public uploadedImage2: UploadedImage | null = null;

  public processedImage1: string | null = null;
  public processedImage2: string | null = null;

  public isButtonActive = false;
  public showResultSection = false;

  public coloredPoints: Point[] = [];

  // Utiliser le décorateur @Getter pour accéder aux getters du store
  @Getter displayedPoints!: Point[];

  // Utiliser le décorateur @Mutation pour appeler les mutations du store
  @Mutation setDisplayedPoints!: (displayedPoints: Point[]) => void;

  // Utiliser le décorateur @Action pour appeler les actions du store
  @Action fetchPoints!: (formData : FormData) => Promise<void>;

  handleImageDropped(dropZone: number, uploadedImage: UploadedImage): void {
    if (dropZone === 1) {
      this.uploadedImage1 = uploadedImage;
    } else if (dropZone === 2) {
      this.uploadedImage2 = uploadedImage;
    }
    this.checkButtonActivation();
  }

  private checkButtonActivation(): void {
    this.isButtonActive =
      this.uploadedImage1 !== null && this.uploadedImage2 !== null;
  }

  goToPreviousStep() : void{
    this.showResultSection = false;
   // this.isButtonActive = false;
   // this.uploadedImage1 = null;
   // this.uploadedImage2 = null;
  }

  startAlgorithm(): void {
    if (this.isButtonActive) {
      this.showResultSection = true;

   const formData = new FormData();
   if (this.uploadedImage1?.file) {
      formData.append("file1", this.uploadedImage1.file);
    }
    if (this.uploadedImage2?.file) {
      formData.append("file2", this.uploadedImage2.file);
    }

      this.fetchPoints(formData)
        .then(() => {
          const cinqPremiersElements = this.displayedPoints.slice(0, 5);
          this.drawDotsOnImage(
            "uploadedImage1",
            "processedImage1",
            cinqPremiersElements
          );
          this.drawDotsOnImage(
            "uploadedImage2",
            "processedImage2",
            cinqPremiersElements
          );
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des points :",
            error
          );
        });
    }
  }

  private drawDotsOnImage(
    imageProperty: "uploadedImage1" | "uploadedImage2",
    processedImageProperty: "processedImage1" | "processedImage2",
    points: Point[]
  ): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const uploadedImage = this[imageProperty];
    if (ctx && uploadedImage) {
      const img = new Image();
      img.src = uploadedImage.url;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        for (const point of points) {
          ctx.fillStyle = point.color;
          ctx.beginPath();
          const x = imageProperty === "uploadedImage1" ? point.x1 : point.x2;
          const y = imageProperty === "uploadedImage1" ? point.y1 : point.y2;
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
        this[processedImageProperty] = canvas.toDataURL();
      };
    }
  }







 
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
.drop-zone-container {
  display: flex;
  padding: 20px;
}

.drop-zone-divider {
  width: 2px; /* Largeur de la colonne */
  background-color: #000; /* Couleur de fond de la colonne */
  margin: 0 10px; /* Marge autour de la colonne */
  height: 100%; /* Hauteur de la colonne */
}

.image-container {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin-right: 10px;
}

.start-button {
  margin-top: 20px;
  display: block;
  margin: 20px auto;
}


.buttons-container {
  display: flex;
  justify-content: space-between;
}

.second-step-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.previous-button {
  order: 1; /* Changes the order of the button to appear on the left */
}

.submit-button {
  order: 2; /* Changes the order of the button to appear on the right */
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
