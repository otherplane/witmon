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
  actions: {
    notify (payload) {
      useEggStore().app.config.globalProperties.$notify(payload)
    },
    saveClaimInfo (info) {
      localStorage.setItem('tokenInfo', JSON.stringify(info))
    },
    getToken () {
      return JSON.parse(localStorage.getItem('tokenInfo'))
    },
    clearError (error) {
      this.errors[error] = null
    },
    setError (name, error) {
      router.push('/')
      this.errors[name] = error.response.data.message
      this.notify({ message: this.errors[name] })
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
        this.clearError('claim')
        router.push('/')
      } else if (request.error) {
        this.setError('claim', request.error)
      }
    },
    async incubateEgg ({ key }) {
      const tokenInfo = this.getToken()
      const request = await this.api.incubate({
        token: tokenInfo.token,
        key: key
      })
      if (request.error) {
        this.setError('incubate', request.error)
      } else {
        this.clearError('incubate')
        this.getEggInfo()
        router.push('/')
      }
    },
    async getEggList () {
      const tokenInfo = this.getToken()
      const request = await this.api.getEggList({ token: tokenInfo.token })
      if (request.error) {
        this.setError('list', request.error)
      } else {
        this.clearError('list')
        this.list = request
        this.filterEggList('score')
      }
    },
    async getEggInfo () {
      const tokenInfo = this.getToken()
      const request = await this.api.getEggInfo({
        token: tokenInfo.token,
        id: tokenInfo.key
      })
      if (request.error) {
        this.setError('info', request.error)
      } else {
        console.log('request', request)
        this.clearError('info')
        const { username, score, key, index, rarityIndex } = request.egg
        const { incubatedBy, incubating } = request
        this.rarityIndex = rarityIndex
        this.username = username
        this.score = score
        this.color = {
          mainColor: '#fd2',
          baseColor: '#fff'
        }
        this.id = key
        this.index = index
        this.incubated = incubatedBy ? incubatedBy.from : null
        this.incubator = incubating ? incubating.to : null
        this.incubatedTimeLeft = incubatedBy ? incubatedBy.ends : null
        this.incubatingTimeLeft = incubating ? incubating.ends : null
        console.log('getEggIngo', request)
      }
    }
  }
})
