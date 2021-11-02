import { likeSong } from 'network/song'

export const songAbout = {
  state: {},
  mutations: {},
  actions: {
    async likeSong(context, sid) {
      // 判断是添加还是取消
      const likeList = context.rootState.ua.likeList
      let res
      if (likeList.has(sid)) res =  await likeSong(sid, false)
      else res = await likeSong(sid)
      if(res.code===200) context.commit('likelist_songChange',sid)
    }
  }
}
