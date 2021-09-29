import { defineStore } from 'pinia'

export const useEggStore = defineStore('egg', {
  state: () => {
    return { 
      id: null,
      score: null,
      rarityIndex: null,
      timeToBirth: null,
      incubatedTimeLeft: null,
      incubator: null,
      incubatingTimeLeft: null,
      incubated: null,
    }
  },
  // getters: {
  //   double: state => state.count * 2
  // },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    getEggInfo () {
      this.id = 'egg-example'
      this.score = 100
      this.rarityIndex = 100
      this.timeToBirth = 1235678
      this.incubatedTimeLeft = 1235678
      this.incubator = 'fast-rabbit'
      this.incubatingTimeLeft = 1235678
      this.incubated = 'gabaldon'
      // get egg info from axios and set info
    }
  },
})
