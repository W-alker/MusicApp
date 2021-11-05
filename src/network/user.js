import { request } from './request'

export function getUserRecord(uid) {
  return request({
    url: `/user/record?uid=${uid}&type=1`
  })
}
export function getUserPlaylists(uid) {
  return request({
    url: `/user/playlist?uid=${uid}`
  })
}
export function getUserAccount() {
  return request({
    url: '/user/account'
  })
}

export function getUserDetail(uid) {
  return request({
    url: `/user/detail?uid=${uid}`
  })
}
export const personalAbout = {
  getLikelist(uid) {
    return request({
      url: `/likelist?uid=${uid}`
    })
  }
}
