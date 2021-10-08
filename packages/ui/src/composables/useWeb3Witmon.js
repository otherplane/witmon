import { onMounted, ref } from 'vue'
import Web3 from 'web3/dist/web3.min.js'

import { useEggStore } from '@/stores/egg'
import jsonInterface from '../../../core/build/contracts/WitmonMock.json'
import { CONTRACT_ADDRESS } from '../constants'

async function requestAccounts (web3) {
  return await web3.givenProvider.request({ method: 'eth_requestAccounts' })
}

export function useWeb3Witmon () {
  let web3
  const egg = useEggStore()
  const isProviderConnected = ref(false)

  async function enableProvider () {
    const accounts = await requestAccounts(web3)

    if (accounts[0]) {
      isProviderConnected.value = true
    }
  }
  onMounted(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')

      enableProvider()
    }
  })

  async function mint () {
    const contract = new web3.eth.Contract(jsonInterface.abi, CONTRACT_ADDRESS)
    const from = (await requestAccounts(web3))[0]
    const mintArgs = await egg.mint(from)

    contract.methods
      .mintCreature(...mintArgs)
      .send({ from })
      .on('error', error => {
        console.error(error)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmationNumber', confirmationNumber)
        console.log('receipt', receipt)
      })
      .then(newContractInstance => {
        console.log('newContractInstance', newContractInstance)

        const witmon = newContractInstance.events.NewCreature.returnValues
        console.log('witmon minted: ', witmon)
      })
  }

  return {
    mint,
    isProviderConnected,
    enableProvider
  }
}
