export const initActions = {
  state: {
    recovered: false
  },
  actions: {
    recover_lastStatus(context) {
      context.commit('recover_ac')
      context.dispatch('recover_pl')
      context.dispatch('RECOVER_FM')

      if (!localStorage.getItem('songInfo'))
        context.dispatch('init_song', context.rootState.ac.songInfo)
      context.state.recovered = true
    },
    INIT_INFO(context) {
      context.dispatch('init_ua')
    }
  }
}
