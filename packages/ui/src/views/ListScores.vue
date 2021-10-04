<template>
  <div class="scores-container">
    <div class="header">
      <div class="label" @click="orderBy('index')">IDX</div>
      <div class="label" @click="orderBy('username')">USER</div>
      <div class="label" @click="orderBy('score')">SCORE</div>
      <div class="label" @click="orderBy('rarityIndex')">RARITY IDX</div>
    </div>
    <Egg
      v-for="(egg, index) in egg.list"
      :key="egg.index"
      :index="egg.index"
      :dark="index % 2"
      :username="egg.username"
      :score="egg.score"
      :rarityIndex="egg.rarityIndex"
    />
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
    this.egg.getEggList()
  },
  methods: {
    orderBy (label) {
      this.egg.filterEggList(label)
    }
  }
}
</script>

<style scoped lang="scss">
.scores-container {
  .header {
    display: grid;
    background-color: #f8971e;
    grid-template-columns: 50px 200px 50px 50px;
    grid-template-rows: max-content;
    justify-content: center;
    align-items: center;
    .label {
      cursor: pointer;
      color: white;
      font-weight: bold;
      padding: 8px;
    }
  }
}
@media (min-width: 1200px) {
  .scores-container {
    .header {
      grid-template-columns: 10% 30% 10% 10%;
    }
  }
}
</style>
