import { request } from './request'

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
export function getSongLyric(sid) {
  return request({
    url: `/lyric?id=${sid}`
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
