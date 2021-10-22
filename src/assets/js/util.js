// 手机号正则
export function isPoneAvailable(poneInput) {
  const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!myreg.test(poneInput)) {
    return false
  } else {
    return true
  }
}
// 邮箱正则
export function isEmailAvailable(emailInput) {
  var myreg =
    /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  if (!myreg.test(emailInput)) {
    return false
  } else {
    return true
  }
}
export function isNeteaseEmail(email) {
  const reg = /^[A-Za-z]\w{5,17}@(vip\.(126|163|188)\.com|163\.com|126\.com|yeach\.net)/
  if (!reg.test(email)) {
    return false
  } else {
    return true
  }
}

export function debounce(fn, delay = 3000) {
  // 一个要执行防抖的函数，以及延时参数，这里默认500ms
  // 在外部事先定义这个计时器，作为公共定时器变量，确保最后只会执行一个定时器，这样也就只会触发一次事件
  let timeout = null
  return function () {
    clearTimeout(timeout) // 清除上一个定时器
    const ctx = this // 保存this
    const args = arguments // 参数列表，拿到event对象

    // 定义定时器，最后只会触发一次
    timeout = setTimeout(function () {
      fn.apply(ctx, args) // 利用apply，确保函数的this指向不变
      // 当然这里也可以直接使用箭头函数，这样这里的this就无需提前保存
    }, delay)
  }
}