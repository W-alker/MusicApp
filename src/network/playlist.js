import { request } from './request'

export function getPlaylistDetail(pid) {
  return request({
    url: `/playlist/detail?id=${pid}`
  })
}
