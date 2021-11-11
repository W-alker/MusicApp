import { request } from './request'

export const FM = {
  get() {
    return request({
      url: `/personal_fm?timestamp=${Date.now()}`
    })
  },
  trash(sid) {
    return request({
        url: `/fm_trash?id=${sid}&timestamp=${Date.now()}`
    })
  }
}

export function getTodaySongs() {
  return request({
    url: '/recommend/songs'
  })
}
export function getTodayPlaylist() {
  return request({
    url: '/recommend/resource'
  })
}
