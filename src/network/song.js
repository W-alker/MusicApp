import { request } from './request'

export function checkSong(sid) {
  return request({
    url: `/check/music?id=${sid}`
  })
  
}
export function getSongDetail(sid) {
  return request({
    url: `/song/detail?ids=${sid}`
  })
}
export function getSongUrl(sid) {
  return request({
    url: `/song/url?id=${sid}`
  })
}
export function likeSong(sid, like = true) {
  return request({
    url: `/like?id=${sid}&like=${like}`
  })
}

export const Lyric = {
  get(sid) {
    return request({
      url: `/lyric?id=${sid}`
    })
  }
}
export const Mlog = {
  get(sid) {
    return request({
      url: `/mlog/music/rcmd?songid=${sid}`
    })
  },
  toVideo() {},
  getUrl(mid) {
    return request({
      url: `/mlog/url?id=${mid}`
    })
  }
}
