<template>
  <div class="info-container">
    <p class="label">EggScore™</p>
    <p class="label">RARITY INDEX</p>
    <p class="label">TIME TO BIRTH</p>
    <p class="info">{{ score }}</p>
    <p class="info">{{ rarityIndex }}</p>
    <TimeLeft
      v-if="timeToBirth"
      class="info time"
      :timestamp="timeToBirth"
      :seconds="false"
    />
  </div>
</template>

<script>
export default {
  props: {
    score: Number,
    rarityIndex: Number,
    timeToBirth: Number
  }
}
</script>

<style scoped lang="scss">
.info-container {
  display: grid;
  grid-template-columns: 1fr 1fr max-content;
  grid-template-rows: repeat(2, max-content);
  justify-content: space-between;
}
</style>
