import { FM } from 'network/recommend'
import { getSongDetail } from 'network/song'
import { Toast } from 'vant'

export const fmMode = {
  state: {
    isFM_Mode: false
  },
  actions: {
    async INITFM(context) {
      const fm = await FM.get()
      const song = await getSongDetail(fm.data[0].id)
      console.log(song)

      context.dispatch('init_song', song.songs[0])
      context.state.isFM_Mode = true

    },
    async NEXT_FM() {
      this.dispatch('INITFM')
    },
    async FM_TRASH(context) {
      const res = await FM.trash(context.rootState.ac.songInfo.id)
      Toast.success('屏蔽成功')
      if (res.code === 200) this.dispatch('INITFM')
    },
    async QUITFM(context) {
      context.state.isFM_Mode = false
    }
  }
}
