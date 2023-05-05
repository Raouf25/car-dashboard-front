<template>
  <div class="container">
    <h1>1. Uploader des images</h1>
    <div class="drop-zone-container">
      <div class="drop-zone" @dragover.prevent @drop="handleDrop1">
        <p v-if="isZone1Visible">Zone de dépôt 1</p>
        <img
          v-else
          :src="uploadedImage1.url"
          :alt="uploadedImage1.name"
          class="uploaded-image"
        />
      </div>
      <div class="drop-zone-divider"></div>
      <div class="drop-zone" @dragover.prevent @drop="handleDrop2">
        <p v-if="isZone2Visible">Zone de dépôt 2</p>
        <img
          v-else
          :src="uploadedImage2.url"
          :alt="uploadedImage2.name"
          class="uploaded-image"
        />
      </div>
    </div>
    <button
      @click="startAlgorithm"
      :disabled="!isButtonActive"
      class="start-button"
    >
      Start Analyse
    </button>

    <h1 v-if="showResultSection">2. Result :</h1>
    <div v-if="showResultSection" style="display: flex">
      <div style="flex: 1">
        <p>Image 1</p>
        <img
          :src="processedImage1"
          :alt="'Processed ' + uploadedImage1?.name"
        />
      </div>
      <div class="drop-zone-divider"></div>
      <div style="flex: 1">
        <p>Image 2</p>
        <img
          :src="processedImage2"
          :alt="'Processed ' + uploadedImage2?.name"
        />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"; 
import { Point } from "@/dtos/Point";
import { Getter, Mutation, Action } from "vuex-class";

interface UploadedImage {
  name: string;
  url: string;
}

@Component
export default class UploadImagesComponent extends Vue {
  public uploadedImage1: UploadedImage | null = null;
  private uploadedImage2: UploadedImage | null = null;

  private processedImage1: string | null = null;
  private processedImage2: string | null = null;

  private isButtonActive = false;

  public isZone1Visible = true;
  public isZone2Visible = true; // Ajouter cette variable pour gérer la visibilité du texte dans la zone "Zone de dépôt 2"
  public showResultSection = false;

  public coloredPoints: Point[] = [];

  // Utiliser le décorateur @Getter pour accéder aux getters du store
  @Getter displayedPoints!: Point[];

  // Utiliser le décorateur @Mutation pour appeler les mutations du store
  @Mutation setDisplayedPoints!: (displayedPoints: Point[]) => void;

  // Utiliser le décorateur @Action pour appeler les actions du store
  @Action fetchPoints!: () => Promise<void>;

  private handleDrop1(event: DragEvent): void {
    this.handleDrop(event, 1);
  }

  private handleDrop2(event: DragEvent): void {
    this.handleDrop(event, 2);
  }

  private handleDrop(event: DragEvent, dropZone: number): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          const uploadedImage: UploadedImage = {
            name: file.name,
            url: e.target?.result as string,
          };
          if (dropZone === 1) {
            this.uploadedImage1 = uploadedImage;
            this.isZone1Visible = false;
          } else if (dropZone === 2) {
            this.uploadedImage2 = uploadedImage;
            this.isZone2Visible = false;
          }
          this.checkButtonActivation();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  private checkButtonActivation(): void {
    this.isButtonActive =
      this.uploadedImage1 !== null && this.uploadedImage2 !== null;
  }

  private startAlgorithm(): void {
    if (this.isButtonActive) {
      this.showResultSection = true;
      this.fetchPoints()
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

  public resultImage: string | undefined = "";
  // public selectedImage = 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';

  onResult(result: string) {
    this.resultImage = result;
  }
}
</script>

<style scoped>
.drop-zone-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 60vw; /* Ajouter cette propriété pour que la classe "drop-zone-container" prenne la largeur de l'écran */
  margin: 0 auto;
  padding: 20px;
}

.drop-zone {
  flex: 1;
  width: 240px;
  height: 240px;
  border: 4px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px; /* Ajout de la propriété border-radius avec une valeur de 10px pour les angles arrondis */
}

.uploaded-image {
  width: 100vw;
  height: 100vh;
  max-width: 240px;
  max-height: 150px;
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
</style>
