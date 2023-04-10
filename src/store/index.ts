import Vue from 'vue';
import Vuex from 'vuex';
import CarStore from '@/store/modules/carStore';
import globalValues from '@/store/modules/globalValues';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    globalValues,
    CarStore
  }
});
