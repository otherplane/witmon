<template>
  <div class="egg-container">
    <p class="subtitle item">{{ egg.index }}</p>
    <div class="small-title item user">
      <img
        class="small-title egg-image"
        src="@/assets/egg-example.png"
        alt="Witty Creature egg"
      />
      <p>{{ egg.username }}</p>
    </div>
    <p class="small-title item">{{ egg.score }}</p>
    <p class="small-title item">{{ 0 }}</p>
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
.egg-container {
  display: grid;
  grid-template-columns: 50px 220px 50px 50px;
  grid-template-rows: max-content;
  justify-content: center;
  align-items: center;
  .item {
    padding: 16px;
  }
  .user {
    display: flex;
    align-items: center;
    .egg-image {
      margin-right: 24px;
      width: 50px;
    }
  }
}
@media (min-width: 1200px) {
  .egg-container {
    grid-template-columns: 10% 30% 10% 10%;
  }
}
</style>
