<template>
    <div class="site">
      <div class="header">
        <h2>Annotation Project</h2>
      </div>
      <hr />
  
      <div class="content">
        <DrawPoint />
      </div>
  
      <div class="footer">
        <p>© 2023 Makhlouf Company. All rights reserved.</p>
      </div>
    </div>
  </template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";  
import DrawPoint from "@/components/DrawPoint.vue"; 

@Component({
    components: {
      DrawPoint
    }
})
export default class DrawPointView extends Vue { 
}
</script>

<style> 
</style>