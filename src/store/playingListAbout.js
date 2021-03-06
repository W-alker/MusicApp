import { getSongDetail, getSongUrl } from 'network/song'

import { Toast } from 'vant'

export const playingListAbout = {
  state: {
    playingList: [],
    curIndex: 0,
    playMode: 0, //0：顺序播放；1：随机播放；2：单曲循环; 3: 心动模式
    playedIndexArray: new Set()
  },
  mutations: {
    addToPIL(state, song) {
      const len = state.playingList.length
      for (let i = 0; i < len; i++) {
        if (state.playingList[i].id === song.id) {
          return
        }
      }
      state.playingList.unshift(song)
      localStorage.setItem('playingList', JSON.stringify(state.playingList))
    },
    deleteFromPIL(state, sid) {
      let len = state.playingList.length
      if (len == 1) return Toast('暂不支持')
      for (let i = 0; i < len; i++) {
        if (sid === state.playingList[i].id) {
          state.playingList.splice(i, 1)
          return localStorage.setItem('playingList', JSON.stringify(state.playingList))
        }
      }
    } 
  },
  actions: {
    async recover_pl(context) {
      context.state.playMode = JSON.parse(localStorage.getItem('playMode')) || 0

      const data = JSON.parse(localStorage.getItem('playingList'))
      if (data) {
        context.state.playingList = data
        // 找回curIndex
        const curId = context.rootState.ac.songInfo.id
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === curId) return (context.state.curIndex = i)
        }
      }

    },
    async changeSong(context, index) {
      /*       const sid = context.state.playingList[index].id
      const res = await getSongDetail(sid)
      const songDetail = res.songs[0] */
      const songDetail = context.state.playingList[index]
      // 调用ac音频控制模块播放歌曲
      const isOk = await context.dispatch('init_song', songDetail, { root: true })
      context.state.curIndex = index
      if (!isOk) {
        context.dispatch('nextSong')
      }
    },
    change_playMode(context, mode) {
      if (mode) context.state.playMode = mode
      else context.state.playMode++

      if (context.state.playMode === 3) context.state.playMode = 0
      localStorage.setItem('playMode', context.state.playMode)
    },
    updatePIL(context, args) {
      // index代表从当前播放列表哪里开始播放
      const { list, index = 0 } = args
      // 判断是否需要重新录入
      context.state.playingList = list
      context.state.playedIndexArray.clear()
      this.dispatch('changeSong', index)

      // 取消FM模式
      context.dispatch('QUITFM')

      // 本次信息存入本地
      localStorage.setItem('playingList', JSON.stringify(context.state.playingList))
    },

    nextSong(context) {
      if(!context.state.playingList.length) return

      const index = context.state.curIndex
      // 如果已经全部播完就重新计数
      if ((context.state.playedIndexArray.size === context.state.playingList, length))
        context.state.playedIndexArray.clear()
      // 记录此次播放
      context.state.playedIndexArray.add(index)
      // 顺序播放
      if (context.state.playMode === 0) {
        // 判断是否越界
        if (index >= context.state.playingList.length - 1) return this.dispatch('changeSong', 0)
        return this.dispatch('changeSong', index + 1)
      }
      // 随机播放
      else if (context.state.playMode === 1) {
        const randomIndex = (function randomIndex() {
          let index = parseInt(Math.random() * context.state.playingList.length)
          if (!context.state.playedIndexArray.has(index)) return index
          else randomIndex()
        })()
        return this.dispatch('changeSong', randomIndex)
      }
      // 单曲循环
      else return this.dispatch('changeSong', index)
    },
    prevSong(context) {
      if(!context.state.playingList.length) return

      const index = context.state.curIndex
      // 如果已经全部播完就重新计数
      if ((context.state.playedIndexArray.size === context.state.playingList, length))
        context.state.playedIndexArray.clear()
      // 记录此次播放
      context.state.playedIndexArray.add(index)
      // 顺序播放
      if (context.state.playMode === 0) {
        // 判断是否越界
        if (index <= 0) return this.dispatch('changeSong', context.state.playingList.length - 1)
        return this.dispatch('changeSong', index - 1)
      }
      // 随机播放
      else if (context.state.playMode === 1) {
        const randomIndex = (function randomIndex() {
          let index = parseInt(Math.random() * context.state.playingList.length)
          if (!context.state.playedIndexArray.has(index)) return index
          else randomIndex()
        })()
        return this.dispatch('changeSong', randomIndex)
      }
      // 单曲循环
      else return this.dispatch('changeSong', index)
    }
  },
  getters: {
    /*    likePL(state, getters, rootState,rootGetters) {
      // return rootGetters.ua.likePlayList
    } */
  }
}
