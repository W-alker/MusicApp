import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

import { playingListAbout } from './playingListAbout'
import { audioControl } from './audioControl'
import { userAbout } from './userAbout'
import { songAbout } from './songAbout'
import { initActions } from './initActions'

const store = new Vuex.Store({
  modules: {
    ac: audioControl,
    ua: userAbout,
    pl: playingListAbout,
    sa: songAbout,
    init: initActions
  }
})

export default store
