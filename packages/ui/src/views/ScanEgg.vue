<template>
  <SectionHeader>SCAN YOUR QR CODE</SectionHeader>
  <div class="container">
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
    return { egg }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.previousRoute = from.path
    })
  },
  methods: {
    onDecode (decodedString) {
      const chunks = decodedString.split('/')
      this.value = chunks[chunks.length - 1]
      console.log('value', this.value)
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
  max-width: 600px;
  min-height: 100vh;
  display: grid;
  margin: 0 auto;
  grid-template-rows: 1fr;
  justify-items: center;
  align-content: center;
  text-align: center;
  .logo {
    width: 300px;
    margin-bottom: 8px;
  }
}
</style>
