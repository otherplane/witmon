import axios from 'axios'

export class WittyCreaturesApi {
  constructor () {
    this.baseUrl = 'http://127.0.0.1:3000'
  }

  _handleResponse (response) {
    if (response && response.data) {
      return response.data
    }
  }

  _handleError (error) {
    return { error }
  }

  _get ({ url, params }) {
    return axios
      .get(url, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  _post ({ url, params }) {
    return axios
      .post(url, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  claim (params) {
    return this._post({ url: `${this.baseUrl}/claim`, params })
  }

  getEggInfo (params) {
    return this._get({
      url: `${this.baseUrl}/eggs/${params.id}`,
      params: {
        headers: { authorization: params.token }
      }
    })
  }

  getEggList (params) {
    return [
      {
        index: 1,
        key: '8765',
        username: 'pretty-liar',
        score: 80,
        rarityIndex: 50
      },
      {
        index: 2,
        key: '8765',
        username: 'pretty-liar',
        score: 80,
        rarityIndex: 50
      }
    ]
    // return this._get({ url: ``, params })
  }

  incubate (params) {
    return true
    // return this._get({ url: ``, params })
  }
}
