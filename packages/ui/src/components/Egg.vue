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
  grid-template-columns: 45px 200px 60px 50px;
  justify-items: center;
  grid-template-rows: max-content;
  justify-content: center;
  align-items: center;
  .item {
    padding: 8px;
  }
  .user {
    display: grid;
    grid-template-columns: 50px 1fr;
    column-gap: 16px;
    align-items: center;
    justify-self: flex-start;
    .egg-image {
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
