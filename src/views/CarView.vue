<template>
    <div class="container">
      <h1>Liste des voitures</h1>
      <div class="controls">
        <div class="pagesize">
          <label for="pagesize">Taille de page:</label>
          <select v-model="limit" @change="pageSizeChanged">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="pagination">
          <button @click="prevPage()" :disabled="currentPage === 0">Précédent</button>
          <span class="current-page">{{ currentPage + 1 }}/{{ pageCount }}</span>
          <button @click="nextPage()" :disabled="currentPage === pageCount - 1">Suivant</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Constructeur</th>
            <th>Date de création</th>
            <th>Pays</th>
          </tr>
        </thead>
        <tbody>
          <car-line v-for="car in displayedCars" :key="car.id" :car="car" />
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import axiosService from '@/services/Api'
  import { Car } from "@/dtos/Car";
  import CarLine from "@/components/CarLine.vue";
  
  @Component({
      components: {
          CarLine
      }
  })
  export default class CarView extends Vue {
      cars: Car[] = [];
      displayedCars: Car[] = [];
      currentPage = 0;
      limit = 10;
      pageCount = 0;
  
      async created() {
          await this.fetchCars();
      }
  
      async fetchCars() {
          const carResponse = await axiosService.get<Car[]>("/cars",{
              params: {
                  sort: 'createDate'                
              },
              headers: {
                  'Page-Number': this.currentPage,
                  'Page-Size': this.limit
              }
          });
  
          this.cars = carResponse.data;
          this.pageCount = carResponse.headers['page-total'];
          this.displayedCars = this.cars;
      }
  
      async nextPage() {
          this.currentPage++;
          await this.fetchCars();
      }
  
      async prevPage() {
          this.currentPage--;
          await this.fetchCars();
      }
  
      async pageSizeChanged() {
      this.currentPage = 0;
      await this.fetchCars();
    }
  }
  </script>
  
  <style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th,
  td {
    text-align: left;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  button {
    padding: 8px;
    border-radius: 4px;
    border: none;
    background-color: #4CAF50;
    color: #fff;
    cursor: pointer;
  }
  
  button:hover:not([disabled]) {
    background-color: #3e8e41;
  }
  
  button:disabled {
    background-color: #ddd;
    color: #999;
    cursor: not-allowed;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .pagination {
    display: flex;
    align-items: center;
  }
  
  .current-page {
    margin: 0 10px;
  }
  
  .pagesize {
    display: flex;
    align-items: center;
  }
  
  .pagesize label {
    margin-right: 10px;
  }
  </style>