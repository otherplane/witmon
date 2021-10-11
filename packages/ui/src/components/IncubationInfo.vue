<template>
  <div class="incubations">
    <div class="incubation" v-if="selfIncubation">
      <p class="label">CURRENTLY SELF INCUBATING</p>
      <TimeLeft
        class="time"
        :timestamp="incubatedByTimeLeft"
        :seconds="true"
        @clear-incubation="clear"
      />
      <p class="small-title">{{ incubatedBy }}</p>
    </div>
    <div class="incubation" v-if="!selfIncubation && incubatedByTimeLeft">
      <p class="label">CURRENTLY INCUBATED BY</p>
      <TimeLeft
        class="time"
        :timestamp="incubatedByTimeLeft"
        :seconds="true"
        @clear-incubation="clear"
      />
      <p class="small-title">{{ incubatedBy }}</p>
    </div>
    <div class="incubation" v-if="!selfIncubation && incubatingTimeLeft">
      <p class="label">CURRENTLY INCUBATING</p>
      <TimeLeft
        class="time"
        :timestamp="incubatingTimeLeft"
        :seconds="true"
        @clear-incubation="clear"
      />
      <p class="small-title">{{ incubating }}</p>
    </div>
    <div class="empty-state" v-if="!incubatingTimeLeft && !incubatedByTimeLeft">
      No current incubations
    </div>
  </div>
</template>

<script>
import { useEggStore } from '@/stores/egg'
import { computed } from 'vue'
export default {
  props: {
    incubatedByTimeLeft: Number,
    incubatedBy: String,
    incubatingTimeLeft: Number,
    incubating: String,
    selfIncubation: Boolean
  },
  setup (props) {
    const egg = useEggStore()
    const clear = () => egg.getEggInfo()
    return { clear }
  }
}
</script>

<style scoped lang="scss">
.incubations {
  display: flex;
  align-items: center;
  min-height: 80px;
  .incubation {
    display: grid;
    row-gap: 4px;
    margin-right: 16px;
  }
  .empty-state {
    background-color: rgb(237, 240, 247);
    border-radius: 8px;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: lighter;
    width: 100%;
    height: 100%;
    padding: 8px;
  }
}
</style>
