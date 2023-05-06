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

    <h1>2. Result :</h1>
<div style="display: flex;">
  <div style="flex: 1;">
    <p>Image 1</p>
    <img
      :src="processedImage1"
      :alt="'Processed ' + uploadedImage1?.name"
    />
  </div>
  <div class="drop-zone-divider"></div>
  <div style="flex: 1;">
    <p>Image 2</p>
    <img
      :src="processedImage2"
      :alt="'Processed ' + uploadedImage2?.name"
    />
  </div>
</div>


    <button
      @click="edittAlgorithm"
      :disabled="!isButtonActive"
      class="start-button"
    >
      Edit Result
    </button>
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
    if (this.uploadedImage1 !== null && this.uploadedImage2 !== null) {
      this.isButtonActive = true;
    } else {
      this.isButtonActive = false;
    }
  }

  private edittAlgorithm(): void {
    if (this.isButtonActive) {
      console.log("edittAlgorithm");
    }
  }

  // Fonction utilitaire pour générer une couleur aléatoire
  private randomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private generatedColoredPoints(points: Point[]): Point[] {
    // Générer une couleur aléatoire en utilisant la fonction `randomColor`
    const color = this.randomColor();
    for (const point of points) {
      // Générer une couleur aléatoire en utilisant la fonction `randomColor`
      const color = this.randomColor();
      point.color = color;
    }
    return points;
  }

  private startAlgorithm(): void {
    if (
      this.isButtonActive &&
      this.uploadedImage1 !== null &&
      this.uploadedImage2 !== null
    ) {
      console.log("Start Algo");
      this.fetchPoints();
      this.coloredPoints = this.generatedColoredPoints(this.displayedPoints);
    //  this  .coloredPoints  .forEach(element => {  console.log(element.x1,element.y1,element.x2,element.y2,element.color) });
      const cinqPremiersElements =  this.coloredPoints.slice(0, 5);
      cinqPremiersElements.forEach(element => {  console.log(element.x1,element.y1,element.x2,element.y2,element.color) });
      this.drawDotsOnImage(this.uploadedImage1, cinqPremiersElements);
      this.drawDotsOnImage2(this.uploadedImage2, cinqPremiersElements);
    }
  }

  private drawDotsOnImage(uploadedImage: UploadedImage, points: Point[]): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.src = uploadedImage.url;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        for (const point of points) {
          ctx.fillStyle = point.color;
          ctx.beginPath();
          ctx.arc(point.x1, point.y1, 4, 0, 2 * Math.PI);
          ctx.fill();
        }

        this.processedImage1 = canvas.toDataURL();
      };
    }
  }

  private drawDotsOnImage2(
    uploadedImage: UploadedImage,
    points: Point[]
  ): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.src = uploadedImage.url;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        for (const point of points) {
          ctx.fillStyle = point.color;
          ctx.beginPath();
          ctx.arc(point.x2, point.y2, 4, 0, 2 * Math.PI);
          ctx.fill();
        }

        this.processedImage2 = canvas.toDataURL();
      };
    }
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
