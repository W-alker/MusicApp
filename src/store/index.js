import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

import { playingListAbout } from './playingListAbout'
import { audioControl } from './audioControl'
import { userAbout } from './userAbout'
import { songAbout } from './songAbout'
import { initActions } from './initActions'
import { fmMode } from './fmMode'
import { ui } from './uiAbout'
import {intellgenceMode} from './intelligenceMode'

const store = new Vuex.Store({
  modules: {
    ac: audioControl,
    ua: userAbout,
    pl: playingListAbout,
    sa: songAbout,
    init: initActions,
    fm: fmMode,
    ui,
    itm:intellgenceMode
  }
})

export default store
