import { Car } from '@/dtos/Car';
import axiosService from '@/services/Api';

const CarStore = {
   // State
   state: {
    displayedCars: [],
    currentPage: 0,
    pageSize: 10,
    pageCount: 0
  },
// Getters
getters: {
  displayedCars: (state: any): Car[] => {
    return state.displayedCars;
  },
  currentPage: (state: any): number => {
    return state.currentPage;
  },
  pageSize: (state: any): number => {
    return state.pageSize;
  },
  pageCount: (state: any): number => {
    return state.pageCount;
  }
},

 // Mutations
 mutations: {
  setDisplayedCars: (state: any, displayedCars: Car[]): void => {
    state.displayedCars = displayedCars;
  },
  setCurrentPage: (state: any, currentPage: number): void => {
    state.currentPage = currentPage;
  },
  setPageSize: (state: any, pageSize: number): void => {
    state.pageSize = pageSize;
  },
  setPageCount: (state: any, pageCount: number): void => {
    state.pageCount = pageCount;
  }
},

  actions: {

    fetchCars: async (context: any): Promise<void> => {
      // Code pour récupérer les données des voitures depuis une API ou autre source de données
      // et appeler les mutations pour mettre à jour le store
      // ...

        axiosService.get<Car[]>("/cars",{
          params: {
            sort: 'createDate'                
          },
          headers: {
            'Page-Number': context.state.currentPage,
            'Page-Size':  context.state.pageSize
          }
        })
        .then(carResponse => {
          context.commit('setDisplayedCars', carResponse.data);
          context.commit('setPageCount', carResponse.headers['page-total']);
        })
        .catch(error => {
          // Gérer l'erreur ici, par exemple en affichant un message d'erreur, en enregistrant l'erreur dans le store, etc.
          console.error('Erreur lors de la récupération des données des voitures :', error);
        });
  
    },

  },
  modules: {
  }
}


export default CarStore
