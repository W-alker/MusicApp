import { request } from './request'

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
