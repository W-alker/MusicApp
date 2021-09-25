import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: {
        },
        playSongList: [],
        currentPlaylistId: 0
    },
    mutations: {
        changePlaylistId(state,id){
            state.currentPlaylistId=id
        },
        updateLists(state,list) {
            state.playSongList=list;
        },
        addSong(state,obj){
            state.playSongList.push(obj)
        },
        nextSong(state){
            let cur=state.playSongList[0];
            state.playSongList.shift();
            state.playSongList.push(cur);
        },
        preSong(state){
            let cur=state.playSongList[state.playSongList.length-1];
            state.playSongList.pop();
            state.playSongList.unshift(cur)
        },
        rdSong(state){
            state.playSongList.sort(()=>{
                return Math.random()>.5?-1:1
            })
        }
    } 
})

export default store;