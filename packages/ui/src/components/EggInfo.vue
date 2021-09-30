<template>
  <div class="info-container">
    <p class="label">EGG SCORE</p>
    <p class="label">RARITY</p>
    <p class="label">TIME TO BIRTH</p>
    <p class="info">{{ score }}</p>
    <p class="info">{{ rarityIndex }}</p>
    <p class="info">{{ timeToBirth }}</p>
  </div>
</template>

<script>
export default {
  props: {
    score: Number,
    rarityIndex: Number,
    timeToBirth: String
  }
}
</script>

<style scoped lang="scss">
.info-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, max-content);
}
</style>
