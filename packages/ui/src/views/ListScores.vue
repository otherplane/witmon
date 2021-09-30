<template>
  <div class="scores-container">
    <div class="header">
      <div class="label">IDX</div>
      <div class="label">USER</div>
      <div class="label">SCORE</div>
      <div class="label">RARITY</div>
    </div>
    <Egg v-for="egg in egg.list" :key="egg.index" />
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
  }
}
</script>

<style scoped lang="scss">
.scores-container {
  .header {
    display: grid;
    grid-template-columns: 50px 210px 50px 50px;
    grid-template-rows: max-content;
    justify-content: center;
    align-items: center;
    .label {
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
