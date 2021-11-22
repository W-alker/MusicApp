import { request } from './request'

export function getDefaultSearchKeyword() {
  return request({
    url: `/search/default`
  })
}
export function getHotSearch() {
  return request({
    url: `/search/hot`
  })
}
export function getHotSearchDetail() {
  return request({
    url: `/search/hot/detail`
  })
}
export function getSearchSuggests(input) {
  return request({
    url: `/search/suggest?keywords=${input}&type=mobile`
  })
}

// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
// offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30
export function getSearchRes(input, type = 1,offset=0) {
  return request({
    url: `/cloudsearch?keywords=${input}&type=${type}`
  })
}
