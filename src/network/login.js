import { request } from './request'

export const loginStatus = {
  async check() {
    let res = await request({
      url: `/login/status?timestamp=${Date.now()}`
    })
    return res.data
  },
  refresh() {
    return request({
      url: `/login/refresh?timestamp=${Date.now()}`
    })
  }
}
export function logout() {
  return request({
    url: '/logout'
  })
}

export async function signUp(info) {
  let { phone, pwd, captcha, nickname } = info
  let res = await request({
    url: `/register/cellphone?phone=${phone}&password=${pwd}&captcha=${captcha}&nickname=${nickname}`
  })
  return res
}

export const usePhone = {
  // md5_password: md5加密后的密码,传入后 password 参数将失效
  // captcha: 验证码,使用 /captcha/sent接口传入手机号获取验证码,调用此接口传入验证码,可使用验证码登录,传入后 password 参数将失效
  login(phoneNumber, pwd, captcha, md5_password) {
    if (captcha)
      return request({
        url: `/login/cellphone?phone=${phoneNumber}&captcha=${captcha}&timestamp=${Date.now()}`
      })
    return request({
      url: `/login/cellphone?phone=${phoneNumber}&password=${pwd}`
    })
  },
  // 检查手机号是否注册
  async isPhoneExist(number) {
    let res = await request({
      url: `/cellphone/existence/check?phone=${number}`
    })
    return res.exist === 1
  }
}

export const useEmail = {
  login(email, pwd) {
    return request({
      url: `/login?email=${email}&password=${pwd}`
    })
  }
}

export const useVerifyCode = {
  getCaptcha(phoneNumber) {
    return request({
      url: `/captcha/sent?phone=${phoneNumber}&timstamp=${Date.now()}`
    })
  },
  verifyCaptcha(phoneNumber, captcha) {
    return request({
      url: `/captcha/verify?phone=${phoneNumber}&captcha=${captcha}`
    })
  }
}

export function getKey() {
  return request({
    url: `/login/qr/key?timerstamp=${Date.now()}`
  })
}
export function getQr(key) {
  return request({
    url: `/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`
  })
}
export function qrStatus(key) {
  return request({
    url: `/login/qr/check?key=${key}&timerstamp=${Date.now()}`
  })
}
