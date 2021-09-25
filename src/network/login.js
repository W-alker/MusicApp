import { request } from './request'

export function getKey() {
    return request({
        url: `/login/qr/key?timerstamp=${Date.now()}`,
        withCredentials: true, //关键
    })
}
export function getQr(key) {
    return request({
        url: `/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`,
        withCredentials: true, //关键
    })
}
export function qrStatus(key) {
    return request({
        url: `/login/qr/check?key=${key}&timerstamp=${Date.now()}`,
        withCredentials: true, //关键
    })
}



