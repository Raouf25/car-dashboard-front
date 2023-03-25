<template>
    <tr>
      <td>{{ car.type }}</td>
      <td>{{ car.model }}</td>
      <td>{{ car.manufacturer }}</td>
      <td>{{ car.createDate }}</td>
      <td>
        <span v-if="countryCode">
          <country-flag :country="countryCode" />
        </span>
      </td>
      
    </tr>
  </template>
  
  <script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Car } from '@/dtos/Car';
  import CountryFlag from 'vue-country-flag';
  import * as iso from 'iso-3166-1';
  
  @Component({
    components: {
      CountryFlag
    }
  })
  export default class CarLine extends Vue {
    @Prop({ required: true }) car!: Car;
  
    countryCode = '';
    showPopup = false;
    editedCar: Car = { ...this.car }; // Create a copy of the car object to edit
  
   
    
    mounted() {
      const country = iso.whereCountry(this.car.country);
      if (country) {
        this.countryCode = country.alpha3!;
      }
    }
  
  }
  
  </script>
  
  <style scoped>
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 20px;
  }
  
  .popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .popup label {
    margin-top: 10px;
  }
  
  .popup input {
    margin-bottom: 20px;
  }
  
  .popup button {
    margin-right: 10px;
  }
  </style>