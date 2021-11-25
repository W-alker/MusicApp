import { personalAbout, getUserPlaylists } from 'network/user'
import { getLoginStatus } from 'network/home'

import { getPlaylistDetail } from 'network/playlist'
import { Toast } from 'vant'

export const userAbout = {
  state: {
    account: {},
    profile: {},
    likeList: new Set(),
    playlists: [],
    likePL: {},
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
      await this.dispatch('getPlaylists')
      this.dispatch('getLikelist')
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

      const res2 = await getPlaylistDetail(context.state.playlists[0].id)
      context.state.likePL = res2.playlist
    },
    async subscribePL(context, pl, type = 1) {
      let res
      for (let i = 0; i < context.state.playlists.length; i++) {
        if (context.state.playlists[i].id === pl.id) {
          try {
            res = await personalAbout.subscribePL(pl.id, 2)
            if (res.code === 200) {
              this.dispatch('getPlaylists')
              return Toast('取消收藏')
            }
          } catch (e) {
            return Toast.fail('服务器错误')
          }
        }
      }
      try {
        res = await personalAbout.subscribePL(pl.id, type)
        if (res.code === 200) {
          this.dispatch('getPlaylists')
          return Toast.success('歌单已收藏')
        }
      } catch (e) {
        return Toast.fail('服务器错误')
      }
    }
  },
  getters: {
    
  }
}
