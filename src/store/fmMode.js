import { getPersonalFM } from 'network/recommend'
import { getSongDetail } from "network/song";


export const fmMode = {
  state: {},
  actions: {
    async INITFM(context) {
      const fm = await getPersonalFM()
      const song = await getSongDetail(fm.data[0].id)
      console.log(song);

      context.dispatch('init_song', song.songs[0])
      context.dispatch('updatePIL', { list: [song.songs[0]], index: 0 })
    },
    async NEXT_FM() {
        
    }
  }
}
