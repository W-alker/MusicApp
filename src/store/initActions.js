export const initActions = {
  state: {},
  actions: {
    recover_lastStatus(context) {
      context.commit('recover_ac')
      context.dispatch('recover_pl')
    },
    INIT_INFO(context) {
        context.dispatch('init_ua')
    }
  }
}
