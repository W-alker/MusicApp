import { request } from './request'

export function getSongDetail(sid) {
    return request({
        url: `/song/detail?ids=${sid}`,
    })
}
export function getSongUrl(id) {
    return request({
        url: `/song/url?id=${id}`,
    })
}
export function getSongLyric(id) {
    return request({
        url: `/lyric?id=${id}`,
    })
}