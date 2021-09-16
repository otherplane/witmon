<template>
  <HelloWorld msg="hello world" />
  <h1 class="mb-6 text-3xl font-extrabold">Home</h1>

  <p>Counter value in store: {{ count }}</p>
  <p>Double value: {{ double }}</p>
  <button v-on:click="increase" class="btn btn-blue">
    Increment
  </button>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useCounterStore } from '@/stores/counter'
import HelloWorld from './HelloWorld.vue'

export default defineComponent({
  components: {
    HelloWorld
  },
  setup () {
    const counter = useCounterStore()

    return {
      count: computed(() => counter.count),
      double: computed(() => counter.double),
      increase: counter.increment
    }
  }
})
</script>

<style>
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>
