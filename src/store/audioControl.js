import { getSongUrl, checkSong } from 'network/song'
import { songArToStr, throttle } from 'assets/js/util.js'
import { Toast } from 'vant'

export const audioControl = {
  state: {
    songInfo: {
      name: 'The Way I Still Love You',
      id: 28718313,
      pst: 0,
      t: 0,
      ar: [{ id: 42608, name: 'Reynard Silva', tns: [], alias: [] }],
      alia: [],
      pop: 100,
      st: 0,
      rt: null,
      fee: 0,
      v: 4,
      crbt: null,
      cf: '',
      al: {
        id: 2866545,
        name: 'Reynard Silva',
        picUrl: 'http://p3.music.126.net/JyPsd_g00M-4mqXLLtHncw==/5984641790343690.jpg',
        tns: [],
        pic: 5984641790343690
      },
      dt: 226000,
      h: { br: 320000, fid: 0, size: 9076144, vd: -61509 },
      m: { br: 192000, fid: 0, size: 5445751, vd: -61509 },
      l: { br: 128000, fid: 0, size: 3630554, vd: -61509 },
      a: null,
      cd: '1',
      no: 8,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 2,
      s_id: 0,
      mark: 262144,
      originCoverType: 1,
      originSongSimpleData: null,
      single: 0,
      noCopyrightRcmd: null,
      rtype: 0,
      rurl: null,
      mst: 9,
      cp: 0,
      mv: 0,
      publishTime: 1393948800000,
      arName: 'Reynard Silva',
      url: 'http://m7.music.126.net/20211117115510/6496e0d8f8e16c37d2cb5fc10609e200/ymusic/4b0e/c937/8f7e/465c450cd62e279f2f032385b7f48eb7.mp3'
    }, // 歌曲信息
    isPause: true,
    duration: 0,
    currentTime: 0
  },
  mutations: {
    recover_ac(state) {
      const data = localStorage.getItem('songInfo')
      if (data) state.songInfo = JSON.parse(data)
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
      this.commit('timeUpdate', time)
    }
  },
  actions: {
    async init_song(context, songDetail) {
      // 歌曲信息存入该模块
      context.state.songInfo = songDetail
      context.state.songInfo.arName = songArToStr(context.state.songInfo.ar)

      const check = await checkSong(songDetail.id)
      if (!check.success) return Toast.fail('该歌曲暂无版权，无法播放')
      //  获取音频链接
      const res = await getSongUrl(songDetail.id)
      context.state.songInfo.url = res.data[0].url

      // 更改音频链接
      const audio = document.getElementById('audio')
      audio.src = context.state.songInfo.url

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
