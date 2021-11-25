import { getIntelligencePL, getPlaylistDetail } from 'network/playlist'

export const intellgenceMode = {
  state: {
    likeListPid: 0,
    intelligencePL: []
  },
  actions: {
    async changeIntelligencePIL(context, arg) {
      let { id, pid, sid } = arg
      if (pid !== context.rootState.ua.likePLid) return

      if (context.rootState.fm.isFM_Mode) context.dispatch('QUITFM')

      const res = await getIntelligencePL(id, pid, sid)
      const newPIL = []
      const len = res.data.length
      for (let i = 0; i < len; i++) {
        res.data[i].songInfo.recommended = res.data[i].recommended
        newPIL.push(res.data[i].songInfo)
      }

      context.state.intelligencePL = newPIL
      context.dispatch('change_playMode',4)
      context.dispatch('updatePIL', { list: newPIL, index: 0, pid: pid })
      // context.dispatch('init_song', newPIL[0])
    }
  }
}
