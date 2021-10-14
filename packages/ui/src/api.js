import axios from 'axios'

import { API_BASE_URL } from './constants'

export class WittyCreaturesApi {
  constructor () {
    this.baseUrl = API_BASE_URL
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

  _post ({ url, data, params }) {
    return axios
      .post(url, data, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  claim (params) {
    return this._post({ url: `${this.baseUrl}/claim`, data: params })
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
    return this._get({
      url: `${this.baseUrl}/eggs`,
      params: {
        headers: { authorization: params.token }
      }
    })
  }

  incubate (params) {
    return this._post({
      url: `${this.baseUrl}/eggs/incubate`,
      data: { target: params.key },
      params: { headers: { authorization: params.token } }
    })
  }

  getPreview ({ address, token }) {
    console.log('address', address)
    console.log('token', token)
    //TODO: save preview
  }

  mint ({ address, token }) {
    console.log('address', address)
    console.log('token', token)
    return this._post({
      url: `${this.baseUrl}/mint`,
      data: { address },
      params: { headers: { authorization: token } }
    })
  }
}
