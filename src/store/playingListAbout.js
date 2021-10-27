import { getSongDetail, getSongUrl } from 'network/song'

export const playingListAbout = {
  state: {
    playingList: [],
    curIndex: 0
  },
  mutations: {
    addToPIL(state, song) {
      state.playingList.push(song)
    }
  },
  actions: {
    async changeSong(context, index) {
      const sid = context.state.playingList[index].id
      const res = await getSongDetail(sid)
      const songDetail = res.songs[0]

      context.state.curIndex = index
      // 调用ac音频控制模块播放歌曲
      context.dispatch('init_song', songDetail, { root: true })
    },
    updatePIL(context, args) {
      // index代表从当前播放列表哪里开始播放
      const { list, index } = args
      //   console.log(args, list, index)
      context.rootState.pl.playingList = list
      this.dispatch('changeSong', index)
    },
    nextSong(context) {
      const index = context.state.curIndex
      this.dispatch('changeSong', index + 1)
    }
  },
  getters: {}
}
