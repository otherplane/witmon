<template>
  <div class="info-container">
    <div>
      <p class="label">EggScore™</p>
      <p class="info">{{ score }}</p>
    </div>
    <div>
      <p class="label">RARITY INDEX</p>
      <p class="info">{{ rarityIndex }}</p>
    </div>
    <div>
      <p v-if="!hasBorn" class="label">TIME TO BIRTH</p>
      <TimeLeft
        v-if="!hasBorn && timeToBirth"
        class="info time"
        :timestamp="timeToBirth"
        :seconds="false"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    score: Number,
    rarityIndex: Number,
    timeToBirth: Number,
    hasBorn: Boolean
  }
}
</script>

<style scoped lang="scss">
.info-container {
  display: flex;
  justify-content: space-between;
}
</style>
