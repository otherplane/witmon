<template>
  <div class="incubations">
    <div class="incubation" v-if="selfIncubation">
      <p class="label">CURRENTLY INCUBATING</p>
      <TimeLeft
        class="time"
        :timestamp="incubatedTimeLeft"
        :seconds="true"
        @clear-incubation="clear"
      />
      <p class="small-title">{{ incubated }}</p>
    </div>
    <div class="incubation" v-if="!selfIncubation && incubatedTimeLeft">
      <p class="label">CURRENTLY INCUBATED BY</p>
      <TimeLeft
        class="time"
        :timestamp="incubatedTimeLeft"
        :seconds="true"
        @clear-incubation="clear"
      />
      <p class="small-title">{{ incubated }}</p>
    </div>
    <div class="incubation" v-if="!selfIncubation && incubatingTimeLeft">
      <p class="label">CURRENTLY INCUBATING</p>
      <TimeLeft
        class="time"
        :timestamp="incubatingTimeLeft"
        :seconds="true"
        @clear-incubation="clear"
      />
      <p class="small-title">{{ incubator }}</p>
    </div>
    <div class="empty-state" v-if="!incubatingTimeLeft && !incubatedTimeLeft">
      No current incubations
    </div>
  </div>
</template>

<script>
import { useEggStore } from '@/stores/egg'
import { computed } from 'vue'
export default {
  props: {
    incubatedTimeLeft: Number,
    incubator: String,
    incubatingTimeLeft: Number,
    incubated: String
  },
  setup (props) {
    const egg = useEggStore()
    const clear = () => egg.getEggInfo()
    const selfIncubation = computed(() => {
      return props.incubator && props.incubator === props.incubated
    })
    return { clear, selfIncubation }
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
