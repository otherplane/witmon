<template>
  <div class="container">
    <img
      src="@/assets/witnet-logo.svg"
      alt="Witty creatures logo"
      class="witnet-logo"
    />
    <div>
      <p class="subtitle">THE DECENTRALIZED ORACLE PRESENTS</p>
    </div>
    <img
      src="@/assets/witty-creatures-logo.svg"
      alt="Witty creatures logo"
      class="logo"
    />
    <div>
      <h1 class="title">LISCON 2021<br />SPECIAL EDITION</h1>
      <p class="subtitle">aka "O JOGO DOS OVOS"</p>
    </div>
    <p class="small-title">
      Join us in the funniest and most gamified NFT minting ceremony,
      exclusive for LisCon attendees, featuring the cutest creatures in crypto,
      and powered by the Witnet oracle's Random Number Generator.
    </p>
    <router-link to="/disclaimer" class="link">
      <Button class="btn" color="black">
        Play now
      </Button>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.container {
  grid-row: 2;
  margin: 0 auto;
  padding: 32px;
  max-width: 600px;
  row-gap: 16px;
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .witnet-logo {
    width: 150px;
  }
  .link {
    width: 100%;
  }
  .logo {
    width: 300px;
  }
}
</style>
