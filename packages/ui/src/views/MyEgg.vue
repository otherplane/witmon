<template>
  <div class="container">
    <div>
      <p class="subtitle">EGG ID: {{ egg.username }}</p>
      <p class="title">My Witty Creature</p>
    </div>
    <img
      class="egg-image"
      src="@/assets/egg-example.png"
      alt="Witty Creature egg"
    />
    <EggInfo
      :score="egg.score || 0"
      :rarityIndex="egg.rarityIndex || 0"
      :timeToBirth="egg.timeToBirth || 0"
    />
    <IncubationInfo
      :incubatedTimeLeft="egg.incubatedTimeLeft || 0"
      :incubator="egg.incubator || null"
      :incubatingTimeLeft="egg.incubatingTimeLeft || 0"
      :incubated="egg.incubated || null"
    />
    <div class="buttons">
      <router-link to="/scan-egg" class="center-item">
        <Button color="green">
          Incubate my egg
        </Button>
      </router-link>
      <router-link to="/scan-egg" class="center-item">
        <Button color="purple">
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

export default {
  setup () {
    const egg = useEggStore()
    return { egg }
  },
  created () {
    this.egg.getEggInfo()
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
