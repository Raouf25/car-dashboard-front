<template>
    <div>
      <h1>Uploader des images</h1>
      <div class="drop-zone-container">
        <div class="drop-zone" @dragover.prevent @drop="handleDrop">
          <p>Zone de dépôt 1</p>
        </div>
        <div class="drop-zone-divider"></div> <!-- Colonnes ajoutée -->
        <div class="drop-zone" @dragover.prevent @drop="handleDrop">
          <p>Zone de dépôt 2</p>
        </div>
      </div>
      <div class="image-container">
        <h2>Images téléchargées :</h2>
        <ul>
          <li v-for="(image, index) in uploadedImages" :key="index">
            <img :src="image.url" :alt="image.name" />
          </li>
        </ul>
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
  private isButtonActive = false; // Nouvelle variable pour gérer l'état du bouton

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      // Parcourir les fichiers pour les lire en tant que Blob et les afficher
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImages.push({ name: file.name, url: e.target?.result as string });
          this.checkButtonActivation(); // Appeler la fonction pour vérifier si le bouton doit être activé
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
  width: 200px;
  height: 200px;
  border: 4px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px; /* Ajout de la propriété border-radius avec une valeur de 10px pour les angles arrondis */
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
