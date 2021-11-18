// 层级记录
//footplaybar:3060
//
export const ui = {
  state: {
    isHideFootPlayBar: false
  },
  mutations: {
    hideFootPlayBar(state) {
      state.isHideFootPlayBar = true
    },
    showFootPlayBar(state) {
      state.isHideFootPlayBar = false
    }
  },
  actions: {}
}
