import { request } from './request'

export function getPersonalFM() {
    return request({
        url: '/personal_fm'
    })
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
