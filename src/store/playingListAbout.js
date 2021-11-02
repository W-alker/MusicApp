import { getSongDetail, getSongUrl } from 'network/song'

export const playingListAbout = {
  state: {
    playingList: [
      {
        id: 0
      }
    ],
    curIndex: 0,
    playMode: 0, //0：顺序播放；1：随机播放；2：单曲循环
    playedIndexArray: new Set()
  },
  mutations: {
    addToPIL(state, song) {
      state.playingList.push(song)
    },
    change_playMode(state) {
      state.playMode++
      if (state.playMode === 3) state.playMode = 0
    }
  },
  actions: {
    recover_pl(context) {
      const data = JSON.parse(localStorage.getItem('playingList'))
      // if(data)
      context.state.playingList = data
      // 找回curIndex
      const curId = context.rootState.ac.songInfo.id
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === curId) return (context.state.curIndex = i)
      }
    },
    async changeSong(context, index) {
      /*       const sid = context.state.playingList[index].id
      const res = await getSongDetail(sid)
      const songDetail = res.songs[0] */
      const songDetail = context.state.playingList[index]
      context.state.curIndex = index
      // 调用ac音频控制模块播放歌曲
      context.dispatch('init_song', songDetail, { root: true })
    },
    updatePIL(context, args) {
      // index代表从当前播放列表哪里开始播放
      const { list, index } = args
      //   console.log(args, list, index)
      // 判断是否需要重新录入
      /* if (context.state.playingList[0].id !== list[0].id)  */ context.state.playingList = list
      context.state.playedIndexArray.clear()
      this.dispatch('changeSong', index)

      // 本次信息存入本地
      localStorage.setItem('playingList', JSON.stringify(context.state.playingList))
    },
    nextSong(context) {
      const index = context.state.curIndex
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
        return this.dispatch('changeSong',randomIndex)
      }
      // 单曲循环
      else return this.dispatch('changeSong', index)
    },
    prevSong(context) {
      const index = context.state.curIndex
      context.state.playedIndexArray.push(index)
      if (index <= 0) return this.dispatch('changeSong', context.state.playingList.length - 1)
      return this.dispatch('changeSong', index - 1)
    }
  },
  getters: {}
}
