<template>
   <span class="material-icons hover-green" @click="editCar(car.id)" >edit</span>
</template>

  <script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Car } from '@/dtos/Car';

  @Component
export default  class EditModal extends Vue{

        @Prop({ required: true }) car!: Car;
  
    countryCode = '';
    showPopup = false;
    editedCar: Car = { ...this.car }; // Create a copy of the car object to edit
  
   
    async editCar(id: number) {
      console.log('edit ' ,id)
  /* try {
    // fetch the car with the given id
    const car = await axiosService.get<Car>(`/cars/${id}`);
    
    // display a dialog box with a form to edit the car
    const result = await this.$bvModal.prompt(
      `Edit car ${car.marque} ${car.modele}`,
      {
        size: "lg",
        titleClass: "text-primary",
        centered: true,
        noCloseOnBackdrop: true,
        hideHeaderClose: true,
        hideFooter: true,
        contentClass: "bg-transparent",
        inputAttrs: {
          value: `${car.marque} ${car.modele}`,
        },
      }
    );
    
    // if the user clicked on the 'Ok' button, update the car
    if (result) {
      const [marque, modele] = result.split(" ");
      
      await axiosService.put(`/cars/${id}`, { marque, modele });
      
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


  .hover-green:hover {
  color: green;
}
</style>