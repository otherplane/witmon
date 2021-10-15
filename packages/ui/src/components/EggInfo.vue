<template>
  <div class="info-container">
    <div>
      <p class="label">EGGSCORE™</p>
      <p class="info">{{ score }}</p>
    </div>
    <div>
      <p class="label">RARITY RANK</p>
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
    <div>
      <p v-if="mintStatus" class="label">STATUS</p>
      <Label v-if="mintStatus" :status="mintStatus" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    score: Number,
    rarityIndex: String,
    timeToBirth: Number,
    hasBorn: Boolean,
    mintStatus: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped lang="scss">
.info-container {
  display: flex;
  justify-content: space-between;
}
.label {
  margin-bottom: 4px;
}
</style>
