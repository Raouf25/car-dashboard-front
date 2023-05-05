import { Point } from '@/dtos/Point';
import axiosService from '@/services/Api';

const PointStore = {
   // State
   state: {
    displayedPoints: []
  },
// Getters
getters: {
  displayedPoints: (state: any): Point[] => {
    return state.displayedPoints;
  } 
},

 // Mutations
 mutations: {
  setDisplayedPoints: (state: any, displayedPoints: Point[]): void => {
    state.displayedPoints = displayedPoints;
  }
},

  actions: {

    fetchPoints: async (context: any): Promise<void> => {
      // Code pour récupérer les données des voitures depuis une API ou autre source de données
      // et appeler les mutations pour mettre à jour le store
      // ...

        axiosService.get<Point[]>("/points")
        .then(pointResponse => {
          context.commit('setDisplayedPoints', pointResponse.data);
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


export default PointStore
