import { request } from './request'

export const getHomePageContent = {
  // 大体区块
  Blocks(needRefresh = false) {
    return request({
      url: `/homepage/block/page?refresh=${needRefresh}`
    })
  },
  // 圆形图标列表
  DragonBalls() {
    return request({
      url: '/homepage/dragon/ball'
    })
  }
}
export function getBanner() {
  return request({
    url: `/banner?type=2`
  })
}
// 获取登录状态
export function getLoginStatus() {
  return request({
    url: `/login/status`
  })
}

export function getUserDetail(uid) {
  return request({
    url: `/user/detail?uid=${uid}`
  })
}
export function getUserPlaylist(uid) {
  return request({
    url: `/user/playlist?uid=${uid}`
  })
}
export function getListDetail(id) {
  return request({
    url: `/playlist/detail?id=${id}`
  })
}
