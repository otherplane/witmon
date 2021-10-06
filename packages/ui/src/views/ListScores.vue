<template>
  <div class="scores-container">
    <SectionHeader>LEADER BOARD</SectionHeader>
    <div class="table-header">
      <div class="label" @click="orderBy('index')">INDEX</div>
      <div class="label" @click="orderBy('username')">USER</div>
      <div class="label" @click="orderBy('score')">SCORE ™</div>
      <div class="label" @click="orderBy('rarityIndex')">RARITY INDEX</div>
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
  .table-header {
    display: grid;
    background-color: rgb(237, 240, 247);
    grid-template-columns: 45px 200px 60px 50px;
    padding: 16px 0;
    grid-template-rows: max-content;
    justify-content: center;
    align-items: center;
    .label {
      cursor: pointer;
      color: black;
      text-align: center;
      font-weight: lighter;
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
