<template>
  <div class="container">
    <p>THE DECENTRALIZED ORACLE</p>
    <p>PRESENTS</p>
    <img src="@/assets/witty-creatures-logo.svg" alt="Witty creatures logo" class="logo"/>
    <p>LISCON 2021</p>
    <p>SPECIAL EDITION</p>
    <p>aka "O JOGO DOS OVOS"</p>
    <p>Join us in the funiest and most gamified NFT minting ceremony even, featuring the cutest creatures in crypto</p>
    <Button class="btn" color="black">
      <a href="/scan-egg">
        Play now
      </a>
    </Button>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 16px;
  max-width: 700px;
  row-gap: 18px;
  display: grid;
  grid-template-rows: repeat(8, max-content);
  justify-items: center;
  align-content: center;
  text-align: center;
  .logo {
    width: 300px;
  }
}
</style>
