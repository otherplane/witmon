<template>
  <SectionHeader>DISCLAIMER</SectionHeader>
  <div class="container">
    <p class="warning">⚠️</p>
    <p class="small-title">
      Remember: once you claim your egg, it will be forever linked to your web
      browser and the QR code will not work in a different browser. You are
      highly encouraged to export your egg from the main screen of the game as
      backup, or in case that you need to move your egg into a different
      browser.
    </p>
    <router-link to="/scan-egg" class="link">
      <Button class="btn" color="black">
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
  .bold {
    font-weight: bold;
  }
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
