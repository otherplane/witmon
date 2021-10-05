<template>
  <div class="container">
    <div>
      <p class="subtitle">EGG ID: {{ egg.username }}</p>
      <p class="title">My Witty Creature</p>
    </div>
    <QRCodeVue3
      class="egg-image"
      :value="egg.id || ''"
      :image="imageUrl"
      :dotsOptions="{
        type: 'dots',
        color: '#000000',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#000000' },
            { offset: 1, color: '#000000' }
          ]
        }
      }"
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
      <Button color="grey" class="center-item">
        Help
      </Button>
    </div>
  </div>
</template>

<script>
import { useEggStore } from '@/stores/egg'
import { computed, onBeforeMount, ref } from 'vue'
import QRCodeVue3 from 'qrcode-vue3'
import imageUrl from '@/assets/egg-example.png'

export default {
  components: {
    QRCodeVue3
  },
  setup () {
    const egg = ref(useEggStore())
    onBeforeMount(() => {
      egg.value.getEggInfo()
    })
    const type = computed(() =>
      egg.value && (egg.value.incubator || egg.value.incubated)
        ? 'disable'
        : 'default'
    )
    const incubateMyEgg = () => {
      if (type.value !== 'disable') {
        egg.value.incubateEgg({ key: egg.value.id })
      }
    }
    return { egg, type, incubateMyEgg, imageUrl }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 16px;
  max-width: 600px;
  display: grid;
  grid-template-rows: repeat(5, max-content);
  align-content: center;
  text-align: left;
  row-gap: 16px;
  .egg-image {
    width: 40%;
    justify-self: center;
  }
  .center-item {
    justify-self: center;
    max-width: 600px;
    width: 100%;
  }
  .buttons {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(237, 240, 247);
    padding: 16px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    width: 100%;
    display: grid;
    grid-template-rows: repeat(4, max-content);
    row-gap: 8px;
  }
}
</style>
