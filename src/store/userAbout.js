export const userAbout = {
  state: {},
  mutations: {},
  actions: {
    recover_lastStatus(context) {
      context.commit('recover_ac')
      context.dispatch('recover_pl')
    }
  },
  getters: {}
}
