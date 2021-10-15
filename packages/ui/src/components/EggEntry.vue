<template>
  <div class="egg-container" :class="{ dark: dark }">
    <Egg class="egg-image item" :index="index" />
    <div class="small-title item user">
      <p>{{ username }}</p>
    </div>
    <p class="small-title item score">{{ score }}</p>
  </div>
</template>

<script>
import Egg from './Egg.vue'
export default {
  components: { Egg },
  props: {
    index: Number,
    username: String,
    score: Number,
    rarityIndex: String,
    dark: Number
  }
}
</script>

<style scoped lang="scss">
.dark {
  background: rgb(237, 240, 247);
}
.egg-container {
  padding: 8px 24px;
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  justify-items: center;
  grid-template-rows: max-content;
  justify-content: center;
  align-items: center;
  .item {
    padding: 8px;
    text-align: center;
  }
  .score {
    width: 80px;
    word-break: break-all;
  }
  .egg-image {
    height: auto;
    width: 50px;
  }
}
</style>
