<template>
  <SectionHeader>SCAN YOUR QR CODE</SectionHeader>
  <div class="container">
    <QrStream @decode="onDecode"></QrStream>
    <img
      src="@/assets/witty-creatures-logo.svg"
      alt="Witty creatures logo"
      class="logo"
    />
    <input
      v-model="eggKey"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="username"
      type="text"
      placeholder="Egg ID"
    />
    <Button color="black" @click="submitAndRedirect">
      Submit
    </Button>
    <p v-if="egg.errors.claim" class="error">{{ egg.errors.claim }}</p>

    <label
      v-if="!fileInfo"
      class="w-64 flex flex-col items-center px-4 py-6 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-purple-600 hover:text-white text-purple-600 ease-linear transition-all duration-150"
    >
      <i class="fas fa-cloud-upload-alt fa-3x"></i>
      <span class="mt-2 text-base leading-normal">Select a file</span>
      <input ref="myFile" type="file" class="hidden" @change="onFileSelected" />
    </label>

    <div v-else>
      <p>You are going to import:</p>
      <p>{{ fileInfo.username }}</p>
      <p>{{ fileInfo.key }}</p>

      <Button color="black" @click="saveInfo">
        Import
      </Button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { useEggStore } from '@/stores/egg'
import { QrStream } from 'vue3-qr-reader'
import { useRouter } from 'vue-router'
import { useFileUploader } from '@/composables/useFileUploader'

export default {
  components: {
    QrStream
  },
  setup (props, ctx) {
    const instance = getCurrentInstance()
    const egg = useEggStore()
    const eggKey = ref(null)

    const router = useRouter()
    const fileUploader = useFileUploader()
    const previousRoute = ref('')

    function saveInfo () {
      localStorage.setItem('tokenInfo', JSON.stringify(fileUploader.fileInfo))
      router.push('/my-egg')
    }

    function submitAndRedirect () {
      if (previousRoute.value.includes('/my-egg')) {
        egg.incubateEgg({ key: eggKey.value })
      } else {
        egg.claim({ key: eggKey.value })
      }
    }

    function onDecode (decodedString) {
      const chunks = decodedString.split('/')
      const key = chunks[chunks.length - 1]
      if (key) {
        eggKey.value = key
        submitAndRedirect()
      }
    }

    return {
      egg,
      onFileSelected: fileUploader.onFileSelected,
      myFile: fileUploader.myFile,
      fileInfo: fileUploader.fileInfo,
      eggKey,
      saveInfo,
      submitAndRedirect,
      onDecode,
      previousRoute
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.previousRoute = from.path
    })
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
