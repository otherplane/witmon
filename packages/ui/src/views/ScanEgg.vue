<template>
  <div class="container">
    <p>IMPORT EGG ID</p>
    <input value="Hello world" name="my-input" />
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