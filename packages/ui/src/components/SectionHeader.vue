<template>
  <div class="header">
    <router-link to="/">
      <img src="@/assets/back-btn.svg" alt="Back button" class="back-btn" />
    </router-link>
    <div class="logo">
      <img src="@/assets/witty-creatures-logo.svg" alt="Witty creatures logo" />
      <p class="information"><slot></slot></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: black;
  .back-btn {
    width: 20px;
  }
  .logo {
    width: 150px;
    display: grid;
    grid-template-rows: 1fr;
    width: max-content;
    justify-items: center;
    .information {
      margin-top: 4px;
      font-size: 12px;
      font-weight: lighter;
    }
  }
}
</style>
