<template>
  <div class="incubations">
    <p class="label">CURRENTLY INCUBATED BY</p>
    <p class="label">CURRENTLY INCUBATING</p>
    <p class="time">{{ incubatedTimeLeft }}</p>
    <p class="time">{{ incubatingTimeLeft }}</p>
    <p class="small-title">{{ incubator }}</p>
    <p class="small-title">{{ incubated }}</p>
  </div>
</template>

<script>
export default {
  props: {
    incubatedTimeLeft: Number,
    incubator: String,
    incubatingTimeLeft: Number,
    incubated: String
  }
}
</script>

<style scoped lang="scss">
.incubations {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, max-content);
  margin-bottom: 24px;
}
</style>
