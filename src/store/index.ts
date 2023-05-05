import Vue from 'vue';
import Vuex from 'vuex';
import CarStore from '@/store/modules/carStore';
import PointStore from '@/store/modules/pointStore';
import globalValues from '@/store/modules/globalValues';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    globalValues,
    PointStore,
    CarStore
  }
});
