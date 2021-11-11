import { personalAbout, getUserPlaylists } from 'network/user'
import { getLoginStatus } from 'network/home'
import { Toast } from 'vant'

export const userAbout = {
  state: {
    account: {},
    profile: {},
    likeList: new Set(),
    playlists: []
  },
  mutations: {
    likelist_songChange(state, sid) {
      if (state.likeList.has(sid)) state.likeList.delete(sid)
      else state.likeList.add(sid)
    }
  },
  actions: {
    async init_ua(context) {
      await this.dispatch('getUserInfo')
      this.dispatch('getLikelist')
      this.dispatch('getPlaylists')
    },
    async getUserInfo(context) {
      const loginInfo = await getLoginStatus()
      context.state.account = loginInfo.data.account
      context.state.profile = loginInfo.data.profile
    },
    async getLikelist(context) {
      context.state.likeList.clear()

      const list = await personalAbout.getLikelist(context.state.account.id)
      const len = list.ids.length
      for (let i = 0; i < len; i++) {
        context.state.likeList.add(list.ids[i])
      }
    },
    async getPlaylists(context) {
      const res = await getUserPlaylists(context.state.account.id)
      context.state.playlists = res.playlist
    }
  },
  getters: {}
}
