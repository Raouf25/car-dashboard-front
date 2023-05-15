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

         <div style="display: flex">
            <div style="flex: 1">
               <p>Image 1</p>
               <img :src="processedImage1" :alt="'Processed ' + uploadedImage1?.name"  />
            </div>
            <div class="drop-zone-divider"></div>
            <div style="flex: 1">
               <p>Image 2</p>
               <img :src="processedImage2"  :alt="'Processed ' + uploadedImage2?.name" />
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
    this.isButtonActive = false;
    this.uploadedImage1 = null;
    this.uploadedImage2 = null;
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
            this.displayedPoints
          );
          this.drawDotsOnImage(
            "uploadedImage2",
            "processedImage2",
            this.displayedPoints
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

</style>
