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
      timeToBirth: null,
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
  actions: {
    async claim ({ key }) {
      console.log('claim')
      const request = await this.api.claim({ key })
      if (request.token) {
        await this.saveClaimInfo(request)
        router.push('/my-egg')
      } else if (request.error) {
        this.errors['claim'] = request.error.response.data.message
      }
    },
    async incubateEgg ({ key }) {
      const request = await this.api.incubate({ key })
      if (request) {
        router.push('/my-egg')
        console.log('Incubate egg request:', request)
      } else if (request.error) {
        this.errors['incubate'] = request.error.response.data.message
      }
    },
    saveClaimInfo (info) {
      localStorage.setItem('tokenInfo', JSON.stringify(info))
    },
    getToken () {
      return JSON.parse(localStorage.getItem('tokenInfo'))
    },
    async getEggList () {
      const request = await this.api.getEggList()
      if (request) {
        this.list = request
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
      if (request) {
        this.username = request.username
        this.score = request.score
        this.id = request.key
        this.index = request.index
      } else if (request.error) {
        this.errors['info'] = request.error.response.data.message
      }
    }
  }
})
