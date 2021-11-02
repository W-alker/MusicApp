import { personalAbout } from 'network/user'
import { getLoginStatus } from 'network/home'

export const userAbout = {
  state: {
    account: {},
    profile: {},
    likeList: new Set()
  },
  mutations: {
    likelist_songChange(state,sid) {
      if(state.likeList.has(sid)) state.likeList.delete(sid)
      else state.likeList.add(sid)
      
    }
  },
  actions: {
    init_ua(context) {
      this.dispatch('getLikelist')
      this.dispatch('getUserInfo')
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

  },
  getters: {}
}
