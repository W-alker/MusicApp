import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

import { songArToStr } from 'assets/js/util.js'

const audioControl = {
  state: {
    songInfo: {
      name: '',
      id: 447281999,
      pst: 0,
      t: 0,
      ar: [{ id: 189873, name: '', tns: [], alias: [] }],
      alia: [''],
      pop: 100,
      st: 0,
      rt: null,
      fee: 0,
      v: 25,
      crbt: null,
      cf: '',
      al: {
        id: 35067010,
        name: 'ddddddddddddddddddd',
        picUrl: '',
        tns: [],
        pic_str: '18745573743612130',
        pic: 18745573743612130
      },
      dt: 261915,
      h: { br: 320000, fid: 0, size: 10479325, vd: -79529 },
      m: { br: 192000, fid: 0, size: 6287613, vd: -79529 },
      l: { br: 128000, fid: 0, size: 4191756, vd: -79529 },
      a: null,
      cd: '1',
      no: 1,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 0,
      s_id: 0,
      mark: 128,
      originCoverType: 0,
      originSongSimpleData: null,
      tagPicList: null,
      resourceState: true,
      version: 25,
      songJumpInfo: null,
      single: 0,
      noCopyrightRcmd: null,
      mst: 9,
      cp: 1382818,
      rtype: 0,
      rurl: null,
      mv: 0,
      publishTime: 1467820800000,
      url: '',  // 这是后加的
      arName: '' // 这是后加的
    }, // 歌曲信息
    isPause: true
  },
  mutations: {
    init(state, songDetail) {
      const audio = document.getElementById('audio')
      audio.src = songDetail.url
      audio.play()
      // 歌曲信息存入Vuex
      state.songInfo = songDetail
      state.songInfo.arName = songArToStr(state.songInfo.ar) 
    },
    play() {
      const audio = document.getElementById('audio')
      audio.play()
    },
    pause() {
      const audio = document.getElementById('audio')
      audio.pause()
    },
    playOrPause(state) {
      const audio = document.getElementById('audio')
      state.isPause ? audio.play() : audio.pause()
      state.isPause = !state.isPause
    }
  },
  actions: {},
  getters: {}
}
const userAbout = {
  state: {},
  mutations: {},
  actions: {},
  getters: {}
}
const playingListAbout = {
  state: {},
  mutations: {},
  actions: {},
  getters: {}
}

const store = new Vuex.Store({
  modules: {
    ac: audioControl,
    ua: userAbout
  }
})

export default store
