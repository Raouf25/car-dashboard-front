const globalValues = {
    state: {
      isLoading: false
    },
    getters: {
      isLoadingValue(state: any): boolean {
        return state.isLoading;
      }
    },
    mutations: {
      updateLoading(state: any, newVal: boolean): void {
        state.isLoading = newVal;
      }
    },
    actions: {
      setLoading({ commit }: any, newVal: boolean): void {
        commit('updateLoading', newVal);
      }
    }
  }

  export default globalValues
  