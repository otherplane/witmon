<template>
  <div class="container">
    <div>
      <!-- <img
        src="@/assets/witty-creatures-logo.svg"
        alt="Witty creatures logo"
        class="logo"
      /> -->
      <img
        src="@/assets/witty-creatures-logo.svg"
        alt="Witty creatures logo"
        class="logo"
        @click="egg.claim({ key: 'e9d8e88334820666' })"
      />
      <p class="small-title">Scan your QR code</p>
    </div>
    <QrStream @decode="onDecode"></QrStream>
  </div>
</template>

<script>
import { useEggStore } from '@/stores/egg'
import { QrStream } from 'vue3-qr-reader'

export default {
  data () {
    return {
      previousRoute: null,
      value: null
    }
  },
  components: {
    QrStream
  },
  setup () {
    const egg = useEggStore()
    const value = ''
    return { egg }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.previousRoute = from.path
    })
  },
  methods: {
    onDecode (decodedString) {
      this.value = decodedString
      this.submitAndRedirect()
    },
    submitAndRedirect () {
      if (this.previousRoute === '/my-egg') {
        this.incubateEgg()
      } else {
        this.claimEgg()
      }
    },
    claimEgg () {
      this.egg.claim({ key: this.value })
    },
    incubateEgg () {
      this.egg.incubateEgg({ key: this.value })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 16px;
  max-width: 600px;
  min-height: 100vh;
  row-gap: 18px;
  display: grid;
  grid-template-rows: max-content 1fr;
  justify-items: center;
  align-content: center;
  text-align: center;
  .logo {
    width: 300px;
    margin-bottom: 8px;
  }
}
</style>
