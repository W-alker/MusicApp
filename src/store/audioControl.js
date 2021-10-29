import { getSongUrl } from 'network/song'
import { songArToStr,throttle } from 'assets/js/util.js'

export const audioControl = {
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
        name: '',
        picUrl: '',
        tns: [],
        pic_str: '',
        pic: 0
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
      url: '', // 这是后加的
      arName: '' // 这是后加的
    }, // 歌曲信息
    isPause: true,
    duration: 0,
    currentTime: 0
  },
  mutations: {
    recover_ac(state) {
      const data = localStorage.getItem('songInfo')
      /* if (data)  */ state.songInfo = JSON.parse(data)
      state.duration = Number(localStorage.getItem('duration'))
    },
    play(state) {
      const audio = document.getElementById('audio')
      audio.play()
      state.isPause = false
    },
    pause(state) {
      const audio = document.getElementById('audio')
      audio.pause()
      state.isPause = true
    },
    playOrPause(state) {
      const audio = document.getElementById('audio')
      state.isPause ? audio.play() : audio.pause()
      state.isPause = !state.isPause
    },

    timeUpdate(state, time) {
      state.currentTime = time
    },
    change_playingCourse(state, time) {
      const audio = document.getElementById('audio')
      audio.currentTime = time
      this.commit('timeUpdate',time)
    }
  },
  actions: {
    async init_song(context, songDetail) {
      // 歌曲信息存入该模块
      context.state.songInfo = songDetail
      context.state.songInfo.arName = songArToStr(context.state.songInfo.ar)

      //  获取音频链接
      const res = await getSongUrl(songDetail.id)
      context.state.songInfo.url = res.data[0].url

      // 更改音频链接
      const audio = document.getElementById('audio')
      audio.src = res.data[0].url

      audio.load()
      // 等待音频可以播放
      await audio.addEventListener('canplay', () => {
        context.state.duration = audio.duration
        localStorage.setItem('duration', context.state.duration)
        context.commit('play')
      })

      // 本次信息存入本地
      localStorage.setItem('songInfo', JSON.stringify(context.state.songInfo))
    }
  },
  getters: {}
}
