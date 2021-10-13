<template>
  <SectionHeader>DISCLAIMER</SectionHeader>
  <div class="container">
    <p class="warning">⚠️</p>
    <p class="small-title">
      Remember that once you claim your egg, it cannot be claimed or seen again
      in another natigator. Export your egg in case you want to keep a backup of
      your egg data.
    </p>
    <router-link to="/scan-egg" class="link">
      <Button class="btn" color="red">
        Continue to play
      </Button>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 0 32px;
  max-width: 600px;
  height: 70vh;
  row-gap: 18px;
  display: grid;
  grid-template-rows: repeat(2, max-content);
  justify-items: center;
  align-content: center;
  text-align: center;
  .witnet-logo {
    width: 150px;
  }
  .link {
    width: 100%;
  }
  .warning {
    font-size: 100px;
  }
}
</style>
