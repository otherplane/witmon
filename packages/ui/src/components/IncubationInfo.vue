<template>
  <div class="incubations">
    <p class="label">CURRENTLY INCUBATED BY</p>
    <p class="label">CURRENTLY INCUBATING</p>
    <TimeLeft
      v-if="incubatedTimeLeft"
      class="time"
      :timestamp="incubatedTimeLeft"
      :seconds="true"
    />
    <p v-else class="time">0</p>
    <TimeLeft
      v-if="incubatingTimeLeft"
      class="time"
      :timestamp="incubatingTimeLeft"
      :seconds="true"
      @clear-incubation="clear"
    />
    <p v-else class="time">0</p>
    <p v-if="incubated" class="small-title">{{ incubated }}</p>
    <p v-else class="small-title">No incubation</p>
    <p v-if="incubator" class="small-title">{{ incubator }}</p>
    <p v-else class="small-title">No incubation</p>
  </div>
</template>

<script>
import { useEggStore } from '@/stores/egg'
export default {
  props: {
    incubatedTimeLeft: Number,
    incubator: String,
    incubatingTimeLeft: Number,
    incubated: String
  },
  setup () {
    const egg = useEggStore()
    return { egg }
  },
  methods: {
    clear () {
      this.egg.getEggInfo()
    }
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
