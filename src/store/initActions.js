export const initActions = {
  state: {},
  actions: {
    recover_lastStatus(context) {
      context.commit('recover_ac')
      context.dispatch('recover_pl')
      context.dispatch('RECOVER_FM')
    },
    INIT_INFO(context) {
        context.dispatch('init_ua')
    }
  }
}
