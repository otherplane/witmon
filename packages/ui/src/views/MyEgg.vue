<template>
  <div class="container">
    <div>EGG ID: {{ egg.id }}</div>
    <div>My Witty Creature</div>
    <img src="@/assets/egg-example.png" alt="Witty Creature egg">
    <div class="info">
      <p>EGGS SCORE</p>
      <p>{{ egg.score }}</p>
      <p>RARITY INDEX</p>
      <p>{{ egg.rarityIndex }}</p>
      <p>TIME TO BIRTH</p>
      <p>{{ egg.timeToBirth }}</p>
    </div>
    <div class="incubations">
      <p>CURRENTLY INCUBATED BY</p>
      <p>{{ egg.incubatedTimeLeft }}</p>
      <p>{{ egg.incubator }}</p>
      <p>CURRENTLY INCUBATING</p>
      <p>{{ egg.incubatingTimeLeft }}</p>
      <p>{{ egg.incubated }}</p>
    </div>
    <div class="buttons">
      <Button color="green">
        Incubate my egg
      </Button>
      <Button color="purple">
        Incubate somebody's egg
      </Button>
      <Button color="orange">
        <a href="/scores">
          LeaderBoard
        </a>
      </Button>
      <Button color="grey">
        Help
      </Button>
    </div>
  </div>
</template>

<script>
import { useEggStore } from "@/stores/egg";

export default{
  setup(){
    const egg = useEggStore()
    return {egg}
  }
}
</script>


<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 16px;
  max-width: 700px;
  display: grid;
  grid-template-rows: repeat(6, max-content);
  align-content: center;
  text-align: left;
  row-gap: 24px;
  .buttons {
    width: 100%;
    display: grid;
    grid-template-rows: repeat(4, max-content);
    row-gap: 8px;
  }
}
</style>