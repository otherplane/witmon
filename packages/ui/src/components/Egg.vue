<template>
  <div class="egg-container" :class="{ dark: dark }">
    <p class="subtitle item">{{ index }}</p>
    <div class="small-title item user">
      <img
        class="small-title egg-image"
        src="@/assets/egg-example.png"
        alt="Witty Creature egg"
      />
      <p>{{ username }}</p>
    </div>
    <p class="small-title item">{{ score }}</p>
    <p class="small-title item">{{ rarityIndex }}</p>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    username: String,
    score: Number,
    rarityIndex: Number,
    dark: Number
  }
}
</script>

<style scoped lang="scss">
.dark {
  background: rgb(237, 240, 247);
}
.egg-container {
  display: grid;
  grid-template-columns: 50px 200px 50px 50px;
  grid-template-rows: max-content;
  justify-content: center;
  align-items: center;
  .item {
    padding: 16px;
  }
  .user {
    display: flex;
    align-items: center;
    .egg-image {
      margin-right: 24px;
      width: 50px;
    }
  }
}
@media (min-width: 1200px) {
  .egg-container {
    grid-template-columns: 10% 30% 10% 10%;
  }
}
</style>
