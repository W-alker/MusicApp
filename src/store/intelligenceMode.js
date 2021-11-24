import { getIntelligencePL, getPlaylistDetail } from 'network/playlist'

export const intellgenceMode = {
  state: {
      likeListPid:0,
      intelligencePL: [],
  },
  actions: {
    async changeIntelligencePIL(context, arg) {
      if (context.rootState.fm.isFM_Mode) context.dispatch('QUITFM')

      let { id, pid, sid } = arg
      if (!pid) pid = context.rootState.ua.playlists[0].id // 更改为 我的喜欢 歌单id
      const res = await getIntelligencePL(id, pid, sid)
      const newPIL = []
      const len = res.data.length
      for (let i = 0; i < len; i++) {
        res.data[i].songInfo.recommended = res.data[i].recommended
        newPIL.push(res.data[i].songInfo)
      }

      // 存入临时 我的喜欢 歌单
      if (!context.state.likePL.length) {
        const likePL = await getPlaylistDetail(pid)
        context.state.likePL = likePL.playlist.tracks
      }

      context.dispatch('updatePIL', { list: newPIL, index: 0, pid: pid })
      context.dispatch('init_song', newPIL[0])
    }
  }
}
