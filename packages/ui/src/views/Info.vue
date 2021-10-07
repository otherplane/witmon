<template>
  <SectionHeader>INSTRUCTIONS</SectionHeader>
  <div class="container">
    <div class="content">
      <p class="text">
        At the beginning of the Liscon conference, attendees who visit the
        Witnet booth will be given a physical, wearable and unique "proto-NFT
        egg".
      </p>
      <p class="text">
        The game consists in increasing your
        <span class="black">EggScore™</span> by
        <span class="black">incubating other player's eggs</span> (and thus
        having yours incubated by others).
      </p>
      <p class="text">
        The eggs are made out of
        <span class="black">premium gold-plated printed circuit board</span
        >(PCB) and have a unique <span class="black">QR code</span> printed on
        their back side. The first time this QR is scanned, it'll bring you to
        the WittyCreatures webapp and will link that egg's ID to your device.
      </p>
      <p class="text">
        To <span class="black">incubate</span> somebody's egg, you just need to
        <span class="black">scan their QR code</span>.
      </p>
      <p class="text">
        These are the <span class="black">rules</span> for incubation:
      </p>
      <ul>
        <li class="list">Incubation takes 5 minutes.</li>
        <li class="list">
          You can’t start incubating somebody’s egg while you are incubating
          someone else's — you need to wait until incubation is complete.
        </li>
        <li class="list">
          You can incubate each player’s egg only once every 2 hours.
        </li>
        <li class="list">
          Incubating somebody’s egg gives more points if that is the first time
          interacting with that player.
        </li>
      </ul>
      <p class="text">
        Right after Liscon’s closing ceremony, your egg will
        <span class="black">open</span>, an
        <span class="black">exclusive NFT</span> out of a
        <span class="black">limited series of 500</span> will be born, and you
        will be able to <span class="black">mint</span> it on
        <span class="black">Ethereum</span>!.
      </p>
      <p class="text">
        These NFTs depict different
        <span class="black">WittyCreatures</span> from the crypto ecosystem
        (AAVE’s little ghost, Gnosis’ owl, NEAR’s meerkat, Aragon’s eagle, etc.)
      </p>
      <p class="text">
        However, the higher your EggScore™ ranks in comparison to other players,
        the more numerous and <span class="black">rare traits</span> it will
        get. Inside traits with the same level of rarity, those are chosen at
        random using the Witnet oracle’s new
        <span class="black italic">Random Number Generator</span> functionality.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: grid;
  margin: 0 auto;
  grid-template-rows: 1fr;
  max-width: 600px;
  min-height: 100vh;
}
.content {
  row-gap: 24px;
  display: grid;
  grid-template-rows: 1fr;
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
