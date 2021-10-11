<template>
  <EggSvg :base-color="baseColor" :main-color="mainColor" />
</template>

<script>
import EggSvg from './EggSvg.vue'

const colors = [
  { baseColor: '#fff', mainColor: '#080' },
  { baseColor: '#fff', mainColor: '#333' },
  { baseColor: '#fff', mainColor: '#f00' },
  { baseColor: '#fff', mainColor: '#627' },
  { baseColor: '#000', mainColor: '#fff' },
  { baseColor: '#fff', mainColor: '#fd2' },
  { baseColor: '#fff', mainColor: '#00d' }
]

export default {
  components: { EggSvg },
  computed: {
    baseColor () {
      return colors[this.index % colors.length].baseColor
    },
    mainColor () {
      return colors[this.index % colors.length].mainColor
    }
  },
  props: {
    index: Number
  }
}
</script>

<style scoped></style>
