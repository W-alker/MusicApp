import { likeSong } from 'network/song'
import { Toast } from 'vant'

export const songAbout = {
  state: {},
  mutations: {},
  actions: {
    async likeSong(context, sid) {
      // 判断是添加还是取消
      const likeList = context.rootState.ua.likeList
      let res
      if (likeList.has(sid)) {
        try {
          res = await likeSong(sid, false)
          if (res.code === 200) Toast('取消喜欢')
        } catch (e) {
          res = await likeSong(sid)
          return Toast.fail('操作频繁，请稍后再试！')
        }
      } else {
        try {
          res = await likeSong(sid,true)
          if (res.code === 200) Toast.success('加入喜欢')
        } catch (e) {
          return Toast.fail('操作频繁，请稍后再试！')
        }
      }
      if (res.code === 200) {
        await context.dispatch('getLikelist', sid)
      }
    }
  }
}
