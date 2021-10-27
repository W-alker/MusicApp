import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)


import { playingListAbout } from './playingListAbout'
import { audioControl } from './audioControl'

const userAbout = {
  state: {},
  mutations: {},
  actions: {},
  getters: {}
}





const store = new Vuex.Store({
  modules: {
    ac: audioControl,
    ua: userAbout,
    pl: playingListAbout
  }
})

export default store
