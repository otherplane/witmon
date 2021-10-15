import { onMounted, ref } from 'vue'
import Web3 from 'web3/dist/web3.min.js'

import { useEggStore } from '@/stores/egg'
import jsonInterface from '../WitmonERC721.json'
import { CONTRACT_ADDRESS } from '../constants'

async function requestAccounts (web3) {
  return await web3.givenProvider.request({ method: 'eth_requestAccounts' })
}

export function useWeb3Witmon () {
  let web3
  const egg = useEggStore()
  const isProviderConnected = ref(false)
  const mintedCreatureAddress = ref('')
  const creaturePreview = ref('')

  async function enableProvider () {
    const accounts = await requestAccounts(web3)
    if (accounts[0]) {
      isProviderConnected.value = true
    }
  }

  async function openEgg () {
    const contract = new web3.eth.Contract(jsonInterface.abi, CONTRACT_ADDRESS)
    const from = (await requestAccounts(web3))[0]
    const previewArgs = await egg.getContractArgs(from)
    const preview = await contract.methods
      .previewCreatureImage(...previewArgs.values())
      .call()
    if (preview) {
      egg.savePreview(preview)
    }
  }

  onMounted(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')
      if (egg.hasBorn) {
        enableProvider()
      }
    }
  })

  async function mint () {
    const contract = new web3.eth.Contract(jsonInterface.abi, CONTRACT_ADDRESS)
    const from = (await requestAccounts(web3))[0]
    const mintArgs = await egg.getContractArgs(from)
    contract.methods
      .mintCreature(...mintArgs.values())
      .send({ from })
      .on('error', error => {
        console.error(error)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        egg.saveMintInfo(receipt)
      })
      .then(newContractInstance => {
        console.log('newContractInstance', newContractInstance)

        const witmon = newContractInstance.events.NewCreature.returnValues
        console.log('Witmon minted: ', witmon)
      })
  }

  return {
    mint,
    mintedCreatureAddress,
    isProviderConnected,
    creaturePreview,
    enableProvider,
    openEgg
  }
}
