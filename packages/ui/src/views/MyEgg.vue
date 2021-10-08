<template>
  <div class="container-egg">
    <div class="egg-content">
      <div>
        <p class="subtitle">EGG ID: {{ egg.username }}</p>
        <p class="title">My Witty Creature</p>
      </div>
      <EggSvg
        class="egg-image"
        :mainColor="eggColor.mainColor"
        :baseColor="eggColor.baseColor"
      />
      <EggInfo
        :score="egg.score"
        :rarityIndex="egg.rarityIndex"
        :timeToBirth="egg.timeToBirth"
      />
      <IncubationInfo
        :incubatedTimeLeft="egg.incubatedTimeLeft"
        :incubator="egg.incubator"
        :incubatingTimeLeft="egg.incubatingTimeLeft"
        :incubated="egg.incubated"
      />
    </div>
    <div class="buttons">
      <Button
        color="green"
        :type="type"
        @click="incubateMyEgg"
        class="center-item"
      >
        Incubate my egg
      </Button>
      <router-link
        :to="type === 'disable' ? '' : '/scan-egg'"
        class="center-item"
      >
        <Button color="purple" :type="type">
          Incubate somebody's egg
        </Button>
      </router-link>
      <router-link to="/scores" class="center-item">
        <Button color="orange">
          LeaderBoard
        </Button>
      </router-link>
      <router-link to="/help" class="center-item">
        <Button color="grey" class="center-item">
          Help
        </Button>
      </router-link>

      <Button @click="modal.showModal" color="grey" class="center-item">
        Export
      </Button>

      <Button
        v-if="!isProviderConnected"
        @click="enableProvider"
        color="grey"
        class="center-item"
      >
        Connect metamask
      </Button>
      <Button v-else @click="mint" color="grey" class="center-item">
        Mint
      </Button>
    </div>
  </div>

  <ModalDialog :show="modal.visible.value" v-on:close="modal.hideModal">
    <ModalExport />
  </ModalDialog>
</template>

<script>
import { useEggStore } from '@/stores/egg'
import { computed, onBeforeMount } from 'vue'

import imageUrl from '@/assets/egg-example.png'
import { useModal } from '@/composables/useModal'
import { useWeb3Witmon } from '../composables/useWeb3Witmon'

export default {
  setup () {
    const colors = [
      { baseColor: '#fff', mainColor: '#080' },
      { baseColor: '#fff', mainColor: '#333' },
      { baseColor: '#fff', mainColor: '#627' },
      { baseColor: '#000', mainColor: '#fff' },
      { baseColor: '#fff', mainColor: '#fd2' },
      { baseColor: '#fff', mainColor: '#00d' }
    ]
    const modal = useModal()
    const egg = useEggStore()
    const web3Witmon = useWeb3Witmon()

    onBeforeMount(() => {
      egg.getEggInfo()
    })
    const type = computed(() => (egg.incubator ? 'disable' : 'default'))
    const eggColor = computed(() =>
      Number.isFinite(egg.color)
        ? colors[egg.color]
        : { mainColor: null, baseColor: null }
    )
    function incubateMyEgg () {
      if (type.value !== 'disable') {
        egg.incubateEgg({ key: egg.id })
      }
    }

    return {
      egg,
      type,
      incubateMyEgg,
      imageUrl,
      eggColor,
      modal,
      enableProvider: web3Witmon.enableProvider,
      isProviderConnected: web3Witmon.isProviderConnected,
      mint: web3Witmon.mint
    }
  }
}
</script>

<style scoped lang="scss">
.container-egg {
  min-height: 100vh;
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
  grid-template-rows: repeat(4, max-content);
  align-content: center;
  text-align: left;
  row-gap: 16px;
  .egg-image {
    width: 40%;
    max-height: 150px;
    justify-self: center;
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
