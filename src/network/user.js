import { request } from './request'

export function getUserAccount() {
    return request({
        url: '/user/account'
    })
}

export function getUserDetail(uid) {
    return request({
        url: `/user/detail?uid=${uid}`
    })
}