import { request } from './request'

export function getPlaylistDetail(pid) {
  return request({
    url: `/playlist/detail?id=${pid}`
  })
}
export function getIntelligencePL(id,pid,sid) {
  return request({
    url: `/playmode/intelligence/list?id=${id}&pid=${pid}&${sid?'sid='+sid:''}`
  })
}
