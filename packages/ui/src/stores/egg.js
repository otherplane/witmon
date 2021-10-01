import { defineStore } from 'pinia'
import { WittyCreaturesApi } from '@/api'
import router from '../router'

export const useEggStore = defineStore('egg', {
  state: () => {
    return {
      api: new WittyCreaturesApi(),
      id: null,
      index: null,
      username: null,
      score: null,
      rarityIndex: null,
      timeToBirth: 1635080212000,
      incubatedTimeLeft: null,
      incubator: null,
      incubatingTimeLeft: null,
      incubated: null,
      list: [],
      errors: {
        claim: null,
        info: null,
        list: null,
        incubate: null
      }
    }
  },
  mutations: {},
  actions: {
    saveClaimInfo (info) {
      localStorage.setItem('tokenInfo', JSON.stringify(info))
    },
    getToken () {
      return JSON.parse(localStorage.getItem('tokenInfo'))
    },
    filterEggList (label) {
      this.list.sort((e1, e2) =>
        label === 'score' || label === 'rarityIndex'
          ? e2[label] - e1[label]
          : e1[label] - e2[label]
      )
    },
    async claim ({ key }) {
      const request = await this.api.claim({ key })
      if (request.token) {
        await this.saveClaimInfo(request)
        router.push('/my-egg')
      } else if (request.error) {
        this.errors['claim'] = request.error.response.data.message
      }
    },
    async incubateEgg ({ key }) {
      const tokenInfo = this.getToken()
      const request = await this.api.incubate({
        token: tokenInfo.token,
        key: key
      })
      console.log('Incubate egg request:', request)
      if (request) {
        router.push('/my-egg')
      } else if (request.error) {
        this.errors['incubate'] = request.error.response.data.message
      }
    },
    async getEggList () {
      const tokenInfo = this.getToken()
      const request = await this.api.getEggList({ token: tokenInfo.token })
      if (request) {
        this.list = request
        this.filterEggList('score')
      } else if (request.error) {
        this.errors['list'] = request.error.response.data.message
      }
    },
    async getEggInfo () {
      const tokenInfo = this.getToken()
      const request = await this.api.getEggInfo({
        token: tokenInfo.token,
        id: tokenInfo.key
      })
      console.log('eggInfo:', request)
      if (request) {
        const { username, score, key, index } = request.egg
        const { incubatedBy, incubating } = request
        console.log(incubatedBy)
        this.username = username
        this.score = score
        this.id = key
        this.index = index
        this.incubated = incubatedBy ? incubatedBy.from : null
        this.incubator = incubating ? incubating.to : null
        this.incubatedTimeLeft = incubatedBy ? incubatedBy.ends : null
        this.incubatingTimeLeft = incubating ? incubating.ends : null
      } else if (request.error) {
        this.errors['info'] = request.error.response.data.message
      }
    }
  }
})
