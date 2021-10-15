<template>
  <div class="mint-status" :class="status">{{ status.toUpperCase() }}</div>
</template>

<script>
export default {
  props: {
    status: String
  }
}
</script>

<style scoped lang="scss">
.mint-status {
  width: min-content;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  height: min-content;
  color: white;
}
.minted {
  background: rgb(144, 209, 144);
}
.pending {
  background: rgb(242, 157, 98);
}
</style>
