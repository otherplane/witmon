<template>
  <div class="header">
    <div class="back-container">
      <router-link to="/">
        <img src="@/assets/back-btn.svg" alt="Back button" class="back-btn" />
      </router-link>
      <img
        class="logo"
        src="@/assets/witty-creatures-logo.svg"
        alt="Witty creatures logo"
      />
    </div>
    <p class="information"><slot></slot></p>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: grid;
  padding: 16px 24px;
  grid-template-columns: max-content 1fr;
  align-items: center;
  column-gap: 24px;
  width: 100%;
  color: black;
  .back-container {
    display: flex;
    align-items: center;
    .back-btn {
      width: 20px;
      margin-right: 24px;
    }
  }
  .information {
    text-align: right;
    font-size: 18px;
    font-weight: lighter;
    justify-self: flex-end;
  }
}
</style>
