import { request } from './request'

export function getLoginStatus() {
    return request({
        url: `/login/status`,
        withCredentials: true, 
    })
}
export function getUserDetail(uid) {
    return request({
        url: `/user/detail?uid=${uid}`,
        withCredentials: true, 
    })
}
export function getUserPlaylist(uid) {
    return request({
        url: `/user/playlist?uid=${uid}`,
        withCredentials: true, 
    })
}
export function getListDetail(id) {
    return request({
        url: `/playlist/detail?id=${id}`,
        withCredentials: true, 
    })
}
export function getSongDetail(id) {
    return request({
        url: `/song/detail?ids=${id}`,
        withCredentials: true, 
    })
}
export function getSongUrl(id) {
    return request({
        url: `/song/url?id=${id}`,
        withCredentials: true, 
    })
}
export function getSongLyric(id) {
    return request({
        url: `/lyric?id=${id}`,
        withCredentials: true, 
    })
}









