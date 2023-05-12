import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import CarStore from '@/store/modules/carStore';
import PointStore from '@/store/modules/pointStore';
import globalValues from '@/store/modules/globalValues';

Vue.use(Vuex);

const store: Store<any> = new Vuex.Store({
  modules: {
    globalValues,
    PointStore,
    CarStore
  }
});

export default store;