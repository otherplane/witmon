<template>
  <button class="btn" :class="[color, type]">
    <slot class="btn-content"> </slot>
  </button>
</template>

<script setup>
defineProps({
  color: String,
  type: {
    type: String,
    default: 'default',
    validator (value) {
      return ['default', 'disable'].includes(value)
    }
  }
})
</script>

<style scoped lang="scss">
.btn {
  width: 100%;
  color: white;
  padding: 14px 24px;
  border-radius: 12px;

  &.black {
    background: black;
  }
  &.green {
    background: rgb(25, 208, 172);
  }
  &.purple {
    background: rgb(195, 139, 217);
  }
  &.orange {
    background: rgb(242, 157, 98);
  }
  &.grey {
    background: rgb(128, 128, 128);
  }
  &.disable {
    opacity: 0.6;
    cursor: no-drop;
  }
}
</style>
