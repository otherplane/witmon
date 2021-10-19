<template>
  <SectionHeader>INSTRUCTIONS</SectionHeader>
  <div class="container">
    <div class="content">
      <p class="text">
        WittyCreatures is an <span class="black">NFT minting game</span> in
        which your own actions will affect how rare the resulting NFT will be.
      </p>
      <p class="text">
        The game consist in
        <span class="black">increasing your EggScore™</span> by convincing other
        players to incubate your egg. The higher your EggScore™ is, the more
        numerous and rare traits your Witty Creature NFT will get. Traits with
        the same level of rarity are chosen at random by the
        <span class="black">Witnet oracle’s new Random Number Generator</span>
        functionality.
      </p>
      <p class="text">
        These NFTs will depict different
        <span class="black">WittyCreatures</span> from the crypto ecosystem
        (AAVE's little ghost, Gnosis' owl, NEAR's meerkat, Aragon's eagle, etc.)
      </p>
      <p class="text">
        To incubate somebody's egg, you just need to scan the QR code printed on
        their egg.
      </p>
      <p class="text">
        These are the <span class="black">rules</span> for incubation:
      </p>
      <ul>
        <li class="list">Incubation takes 2 minutes.</li>
        <li class="list">
          You can only incubate one egg at a time — you need to wait until
          incubation is complete.
        </li>
        <li class="list">
          You can repeat incubating the same egg, but only once every 2 hours.
        </li>
        <li class="list">
          If you cannot find anyone else to do it, you can always incubate your
          own egg!
        </li>
        <li class="list">
          Try to find new players to incubate your egg, because being incubated
          again by the same player gives you less points (800, 400, 200, 100,
          50).
        </li>
      </ul>
      <p class="text">
        Right after Liscon’s closing ceremony, your egg will
        <span class="black">open</span>, an
        <span class="black">exclusive NFT</span> out of a
        <span class="black">limited series of 500</span> will be born, and you
        will be able to <span class="black">mint</span> it on
        <span class="black">Ethereum</span>! The minting period will last for
        <span class="black">1 month</span>
        and unclaimed eggs will be forever lost.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: grid;
  margin: 0 auto;
  grid-template-rows: max-content;
  max-width: 700px;
  min-height: 100vh;
}
.content {
  row-gap: 24px;
  display: grid;
  grid-template-rows: max-content;
  text-align: left;
  padding: 32px;
  .list {
    list-style-type: disc;
    margin: 16px;
  }
  .text {
    line-height: 1.5;
    width: 100%;
    .black {
      font-weight: bold;
    }
  }
}
</style>
