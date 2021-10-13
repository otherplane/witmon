<template>
  <SectionHeader>SCAN YOUR QR CODE</SectionHeader>
  <div class="container">
    <QrStream class="pl-4 pr-4 pb-4" @decode="onDecode"></QrStream>
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
    <p v-if="egg.errors.claim" class="error mb-4">{{ egg.errors.claim }}</p>
    <p class="mb-4">Or import your profile</p>
    <label
      v-if="!fileInfo"
      class="mb-8 w-64 flex flex-col items-center px-4 py-6 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-purple-600 hover:text-white text-purple-600 ease-linear transition-all duration-150"
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
      console.log(fileUploader.fileInfo.value)
      localStorage.setItem(
        'tokenInfo',
        JSON.stringify(fileUploader.fileInfo.value)
      )
      router.push(`/egg/${fileUploader.fileInfo.value.key}`)
    }

    function submitAndRedirect () {
      console.log(egg.username)
      if (egg.username) {
        egg.incubateEgg({ key: eggKey.value })
      } else {
        console.log(eggKey.value)
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
