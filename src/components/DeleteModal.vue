<template>
   <span class="material-icons hover-red" @click="deleteCar(carId)">delete</span> 
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
export default  class DeleteModal extends Vue{
    @Prop({ required: true }) carId!: number;

    async deleteCar(id: number) {
  console.log('delete ' ,id)
  /* try {
    // fetch the car with the given id
    const car = await axiosService.get<Car>(`/cars/${id}`);
    
    // display a confirmation dialog box
    const confirmed = await this.$bvModal.msgBoxConfirm(
      `Are you sure you want to delete car ${car.marque} ${car.modele}?`,
      {
        title: "Confirm Deletion",
        centered: true,
        size: "sm",
        buttonSize: "sm",
        okVariant: "danger",
        okTitle: "Delete",
        cancelTitle: "Cancel",
      }
    );
    
    // if the user confirmed the deletion, delete the car
    if (confirmed) {
      await axiosService.delete(`/cars/${id}`);
      
      // fetch the updated car list
      await this.fetchCars();
    }
  } catch (error) {
    console.error(error);
  } */
}
}
</script>

<style>
.hover-red:hover {
  color: red;
}
</style>