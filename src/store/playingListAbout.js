import { getSongDetail, getSongUrl } from 'network/song'

export const playingListAbout = {
  state: {
    playingList: [
      {
        id: 0
      }
    ],
    curIndex: 0
  },
  mutations: {
    addToPIL(state, song) {
      state.playingList.push(song)
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
      this.dispatch('changeSong', index)

      // 本次信息存入本地
      localStorage.setItem('playingList', JSON.stringify(context.state.playingList))
    },
    nextSong(context) {
      const index = context.state.curIndex
      // 判断是否越界
      if (index >= context.state.playingList.length - 1) return this.dispatch('changeSong', 0)
      return this.dispatch('changeSong', index + 1)
    },
    prevSong(context) {
      const index = context.state.curIndex
      if (index <= 0) return this.dispatch('changeSong', context.state.playingList.length - 1)
      return this.dispatch('changeSong', index - 1)
    }
  },
  getters: {}
}
