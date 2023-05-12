<template>
  <div class="drop-zone" @dragover.prevent @drop="handleDrop">
    <p v-if="isVisible">{{ label }}</p>
    <img v-else :src="uploadedImage.url" :alt="uploadedImage.name" class="uploaded-image" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UploadedImage } from "@/dtos/UploadedImage"; // Assurez-vous d'importer correctement le type `UploadedImage`

@Component
export default class DropZone extends Vue {
  public isVisible= true;
  @Prop({ required: true }) label!: string;
  @Prop({ required: true }) uploadedImage!: UploadedImage;

  public handleDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImage: UploadedImage = {
          name: file.name,
          url: e.target?.result as string,
          file: file,
        };
        this.isVisible = false;
        this.$emit("imageDropped", uploadedImage);
      };
      reader.readAsDataURL(file);
    }
  }
}
</script>

<style scoped>
.drop-zone {
  flex: 1;
  width: 240px;
  height: 240px;
  border: 4px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
}

.uploaded-image {
  width: 100vw;
  height: 100vh;
  max-width: 240px;
  max-height: 150px;
}
</style>
