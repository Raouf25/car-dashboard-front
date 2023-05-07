<template>
    <div>
      <div id="cropper-container" :style="containerStyle" :class="containerClass" :alt="alt">
        <img id="image" ref="imgRef" :src="src" :style="imgStyle" :class="imgClass" />
      </div>
      <button @click="crop">Crop</button>
    </div>
  </template>
  
  <script lang="ts">
  import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator';
  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';
  
  type ViewMode = Cropper.ViewMode;
  
  @Component
  export default class CropperComponent extends Vue {
    @Prop() readonly alt!: string;
    @Prop() readonly aspectRatio!: number;
    @Prop() readonly containerClass!: string | object;
    @Prop() readonly containerStyle!: string | object;
    @Prop() readonly height!: number;
    @Prop() readonly imgClass!: string | object;
    @Prop() readonly imgStyle!: string | object;
    @Prop() readonly maxHeight!: number;
    @Prop() readonly maxWidth!: number;
    @Prop() readonly rounded!: boolean;
    @Prop() readonly src!: string;
    @Prop() readonly viewMode!: ViewMode;
    @Prop() readonly width!: number;
  
    @Ref() readonly imgRef!: HTMLImageElement | undefined;
    private cropperInstance: Cropper | undefined = undefined;
    private resultImage: string | undefined = undefined;
    private ready = false;
    private roundedClassIndex: number | undefined = undefined;
  
    mounted() {
      this.start();
    }
  
    beforeUnmount() {
      this.stop();
    }
  
    @Watch('src')
    onSrcChange() {
      this.cropperInstance?.replace(this.src);
    }
  
    private start() {
      if (this.ready || !this.imgRef) {
        return;
      }
      if (this.rounded) {
        document.styleSheets[0].insertRule('.cropper-view-box, .cropper-face { border-radius: 50% }');
      }
      this.cropperInstance = new Cropper(this.imgRef, {
        aspectRatio: this.aspectRatio,
        viewMode: this.viewMode,
        ready: () => {
          this.ready = true;
          this.$emit('ready');
        },
        cropstart: () => this.$emit('start'),
        cropmove: () => this.$emit('move'),
        cropend: () => this.$emit('end'),
        crop: () => this.$emit('crop'),
        zoom: () => this.$emit('zoom')
      });
    }
  
    private stop() {
      if (this.cropperInstance) {
        this.ready = false;
        this.cropperInstance.destroy();
        this.cropperInstance = undefined;
      }
    }
  
    public crop() {
      if (!this.ready || !this.cropperInstance) {
        return;
      }
  
      const options: Cropper.GetCroppedCanvasOptions = {};
  
      if (this.maxHeight) options.maxHeight = this.maxHeight;
      if (this.maxWidth) options.maxWidth = this.maxWidth;
      if (this.height) options.height = this.height;
      if (this.width) options.width = this.width;
  
      const croppedCanvas = this.cropperInstance.getCroppedCanvas(options);
  
      if (this.rounded) {
        const roundedCanvas = this.getRoundedCanvas(croppedCanvas);
        this.resultImage = roundedCanvas.toDataURL();
      } else {
        this.resultImage = croppedCanvas.toDataURL()
    }

    this.$emit('result', this.resultImage);
  }

  private getRoundedCanvas(sourceCanvas: HTMLCanvasElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    if (context) {
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = 'destination-in';
      context.beginPath();
      context.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
      context.fill();
    }

    return canvas;
  }

  private insertRoundedClass() {
    if (this.rounded && !this.roundedClassIndex) {
      this.roundedClassIndex = document.styleSheets[0].insertRule('.cropper-view-box, .cropper-face { border-radius: 50% }');
    }
  }

  private removeRoundedClass() {
    if (!this.rounded && this.roundedClassIndex) {
      document.styleSheets[0].deleteRule(this.roundedClassIndex);
    }
  }

  @Watch('rounded')
  onRoundedChange() {
    if (this.rounded) {
      this.insertRoundedClass();
    } else {
      this.removeRoundedClass();
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>

<style>
.cropper-view-box {
  outline: 0;
  box-shadow: 0 0 0 1px #39f;
}
</style>
