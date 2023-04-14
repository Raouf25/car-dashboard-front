<template>
  <div>
    <h1>Uploader des images</h1>
    <div class="drop-zone-container">
      <div class="drop-zone" @dragover.prevent @drop="handleDrop">
        <p v-if="isZone1Visible">Zone de dépôt 1</p>
        <img v-else :src="uploadedImages[0].url" :alt="uploadedImages[0].name" class="uploaded-image"/>
      </div>

      <div class="drop-zone-divider"></div>

      <div class="drop-zone" @dragover.prevent @drop="handleDrop2">
        <p v-if="isZone2Visible">Zone de dépôt 2</p>
        <img v-else :src="uploadedImages[1].url" :alt="uploadedImages[1].name" class="uploaded-image"/>
      </div>
    </div>

    <button @click="startAlgorithm" :disabled="!isButtonActive" class="start-button">Start Analyse</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

interface UploadedImage {
  name: string;
  url: string;
}

@Component
export default class UploadImagesComponent extends Vue {
  private uploadedImages: UploadedImage[] = [];
  private isButtonActive = false;

  public isZone1Visible = true;
  public isZone2Visible = true; // Ajouter cette variable pour gérer la visibilité du texte dans la zone "Zone de dépôt 2"

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImages.push({ name: file.name, url: e.target?.result as string });
          this.checkButtonActivation();
          if (i === 0) {
            this.isZone1Visible = false;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  private handleDrop2(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImages.push({ name: file.name, url: e.target?.result as string });
          this.checkButtonActivation();
          if (i === 0) {
            this.isZone2Visible = false; // Masquer le texte dans la zone "Zone de dépôt 2" après le premier fichier déposé
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  private checkButtonActivation(): void {
    if (this.uploadedImages.length === 2) {
      this.isButtonActive = true;
    } else {
      this.isButtonActive = false;
    }
  }

  private startAlgorithm(): void {
    if (this.isButtonActive) {
      console.log('Start Algo');
    }
  }
}
</script>

<style scoped>
.drop-zone-container {
  display: flex;
}

.drop-zone {
  flex: 1;
  width: 220px;
  height: 220px;
  border: 4px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px; /* Ajout de la propriété border-radius avec une valeur de 10px pour les angles arrondis */
}

.uploaded-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
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
