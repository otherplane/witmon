<template>
  <div v-if="egg.username" class="container-egg">
    <div class="egg-content">
      <div>
        <p class="subtitle">EGG ID: {{ egg.username }}</p>
        <p class="title">My Witty Creature</p>
      </div>
      <WittyCreature
        v-if="egg.creaturePreview"
        :creature-preview="egg.creaturePreview"
      />
      <Egg v-else class="egg-image" :index="egg.index" />
      <EggInfo
        :score="egg.score"
        :rarityIndex="egg.rarityIndex"
        :timeToBirth="egg.timeToBirth"
        :hasBorn="egg.hasBorn"
        :mintStatus="egg.mintInfo ? mintStatus : null"
      />
      <div
        class="mint-status"
        v-if="egg.mintInfo && egg.mintInfo.transactionHash"
      >
        <p class="label">CONTRACT ADDRESS</p>
        <div class="address">
          <a
            :href="
              `https://rinkeby.etherscan.io/tx/${egg.mintInfo.transactionHash}`
            "
            target="_blank"
            >{{ egg.mintInfo.transactionHash }}
          </a>
          <img class="external-link-icon" src="@/assets/external.svg" alt="" />
        </div>
      </div>
      <IncubationInfo
        v-if="!egg.hasBorn"
        :incubatedByTimeLeft="egg.incubatedByTimeLeft"
        :incubatedBy="egg.incubatedBy"
        :incubatingTimeLeft="egg.incubatingTimeLeft"
        :incubating="egg.incubating"
        :selfIncubation="egg.selfIncubation"
      />
    </div>
    <div class="buttons">
      <Button
        v-if="egg.hasBorn && !egg.creaturePreview"
        @click="openModal('openEgg')"
        color="black"
        class="center-item"
      >
        Open my egg
      </Button>
      <Button
        v-else-if="egg.hasBorn && egg.creaturePreview"
        @click="openModal('mint')"
        :type="type"
        color="black"
        class="center-item"
      >
        Mint
      </Button>
      <Button
        v-if="!egg.hasBorn"
        color="green"
        :type="type"
        @click="incubateMyEgg"
        class="center-item"
      >
        Incubate my egg
      </Button>
      <router-link
        v-if="!egg.hasBorn"
        :to="type === 'disable' ? '' : '/scan-egg'"
        class="center-item"
      >
        <Button color="purple" :type="type">
          Incubate somebody's egg
        </Button>
      </router-link>
      <router-link to="/scores" class="center-item">
        <Button color="orange">
          Leaderboard
        </Button>
      </router-link>
      <router-link to="/help" class="center-item">
        <Button color="grey" class="center-item">
          Help
        </Button>
      </router-link>

      <Button @click="openModal('export')" color="grey" class="center-item">
        Eggxport &trade;
      </Button>
      <p class="footer">
        powered by
        <a class="link" href="https://witnet.io" target="_blank">Witnet</a>
      </p>
    </div>
  </div>

  <ModalDialog :show="modal.visible.value" v-on:close="closeModal">
    <ModalExport v-if="modals.export" />
    <GameOverModal v-if="modals.gameOver" />
    <ModalMint v-if="modals.mint" />
    <ModalOpenEgg v-if="modals.openEgg" />
  </ModalDialog>
</template>

<script>
import { useEggStore } from '@/stores/egg'
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  watch,
  ref
} from 'vue'

import imageUrl from '@/assets/egg-example.png'
import { useModal } from '@/composables/useModal'
import { useWeb3Witmon } from '../composables/useWeb3Witmon'

export default {
  setup () {
    const modal = useModal()
    const egg = useEggStore()
    const web3Witmon = useWeb3Witmon()
    const modals = reactive({
      mint: false,
      export: false,
      openEgg: false,
      gameOver: false
    })
    const hasBorn = egg.hasBorn
    let timeout

    onBeforeMount(async () => {
      await egg.getEggInfo()
      await egg.getMintInfo()
      await egg.getPreview()

      if (!egg.hasBorn) {
        timeout = setTimeout(() => {
          egg.timeToBirth -= 1
        }, egg.timeToBirth - Date.now())
      }
    })

    onBeforeUnmount(() => {
      clearTimeout(timeout)
    })

    const type = computed(() =>
      egg.incubating || (egg.mintInfo && egg.mintInfo.blockHash)
        ? 'disable'
        : 'default'
    )
    const mintStatus = computed(() =>
      egg.mintInfo.blockHash ? 'minted' : 'pending'
    )

    function incubateMyEgg () {
      if (type.value !== 'disable') {
        egg.incubateEgg({ key: egg.id })
      }
    }

    function openModal (name) {
      const needProvider = name === 'mint' || name === 'openEgg'
      if (!web3Witmon.isProviderConnected.value && needProvider) {
        modals['gameOver'] = true
      } else {
        modals[name] = true
      }
      modal.showModal()
    }

    function closeModal () {
      modals.mint = false
      modals.export = false
      modals.openEgg = false
      modals.gameOver = false
      modal.hideModal()
    }

    return {
      hasBorn,
      egg,
      type,
      incubateMyEgg,
      closeModal,
      openModal,
      imageUrl,
      modal,
      modals,
      mintStatus,
      enableProvider: web3Witmon.enableProvider,
      openEgg: web3Witmon.openEgg,
      isProviderConnected: web3Witmon.isProviderConnected,
      mint: web3Witmon.mint
    }
  }
}
</script>

<style scoped lang="scss">
.container-egg {
  grid-row: 2;
  width: 100vw;
  display: grid;
  justify-items: center;
}
.egg-content {
  width: 100%;
  height: 100%;
  padding: 16px;
  max-width: 600px;
  display: grid;
  grid-template-rows: max-content 1fr max-content max-content;
  align-content: center;
  text-align: left;
  row-gap: 16px;
  .egg-image {
    width: 125px;
    height: auto;
    justify-self: center;
    align-self: center;
  }
  .mint-status {
    .label {
      margin-bottom: 8px;
    }
    .address {
      font-weight: 600;
      max-width: 100%;
      word-break: break-all;
      font-size: 16px;
      text-decoration: underline;
      cursor: pointer;
      background-color: rgb(237, 240, 247);
      color: rgb(242, 157, 98);
      padding: 16px;
      border-radius: 15px;
    }
    .external-link-icon {
      width: 12px;
      display: inline;
      margin-left: 4px;
      margin-bottom: 4px;
    }
  }
}
.footer {
  font-size: 12px;
  font-weight: bold;
  color: rgb(128, 128, 128);
  text-align: center;
  padding-top: 8px;
  .link {
    text-decoration: underline;
  }
}
.buttons {
  background-color: rgb(237, 240, 247);
  padding: 16px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(5, max-content);
  row-gap: 8px;
  .center-item {
    justify-self: center;
    max-width: 600px;
    width: 100%;
  }
}
</style>
