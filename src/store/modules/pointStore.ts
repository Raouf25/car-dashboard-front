import { Point } from '@/dtos/Point';
import axiosService from '@/services/Api';

import { ActionContext } from "vuex";
import RootState from "@/store/index";
type UploadImagesActionContext = ActionContext<any, typeof RootState>


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

     fetchPoints: async ( context: UploadImagesActionContext,  formData: FormData  ): Promise<void> => {
      // Code pour récupérer les données des voitures depuis une API ou autre source de données
      // et appeler les mutations pour mettre à jour le store
      // ...
          axiosService.postFiles<Point[]>("/points", formData)
            .then((pointResponse) => {
              context.commit('setDisplayedPoints', pointResponse.data);
            })
            .catch((error) => {
          // Gérer l'erreur ici, par exemple en affichant un message d'erreur, en enregistrant l'erreur dans le store, etc.
              console.error('Erreur lors de la récupération des données des voitures :', error);
            });
    }, 

  },
  modules: {
  }
}


export default PointStore
