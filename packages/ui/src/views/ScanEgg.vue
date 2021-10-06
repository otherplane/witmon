<template>
  <div class="container">
    <SectionHeader>SCAN YOUR QR CODE</SectionHeader>
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
      if (this.previousRoute.includes('/egg')) {
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
  max-width: 600px;
  min-height: 100vh;
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
