<template>
  <div class="container">
    <img
      src="@/assets/witnet-logo.svg"
      alt="Witty creatures logo"
      class="witnet-logo"
    />
    <p class="subtitle">THE DECENTRALIZED ORACLE</p>
    <p class="subtitle">PRESENTS</p>
    <img
      src="@/assets/witty-creatures-logo.svg"
      alt="Witty creatures logo"
      class="logo"
    />
    <h1 class="title">LISCON 2021<br />SPECIAL EDITION</h1>
    <p class="subtitle">aka "O JOGO DOS OVOS"</p>
    <p class="small-title">
      Join us in the funiest and most gamified NFT minting ceremony even,
      featuring the cutest creatures in crypto
    </p>
    <Button class="btn" color="black">
      <router-link to="/scan-egg">
        Play now
      </router-link>
    </Button>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 16px;
  max-width: 600px;
  row-gap: 18px;
  display: grid;
  grid-template-rows: repeat(8, max-content);
  justify-items: center;
  align-content: center;
  text-align: center;
  .witnet-logo {
    width: 150px;
  }
  .logo {
    width: 300px;
  }
}
</style>
