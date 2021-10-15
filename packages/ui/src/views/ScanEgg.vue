<template>
  <SectionHeader>SCAN EGG</SectionHeader>
  <div class="container">
    <p class="small-title import-label">Scan a QR code</p>
    <QrStream class="qr-code pl-4 pr-4 pb-4" @decode="onDecode"></QrStream>

    <Button class="select-file-btn" color="orange" @click="triggerSelectFile">
      <label v-if="!fileInfo" class="select-file-btn">
        <span class="mt-2 text-base leading-normal">Select a file</span>
      </label>
    </Button>

    <input ref="myFile" type="file" class="hidden" @change="onFileSelected" />
    <ModalDialog :show="modal.visible.value" v-on:close="modal.hideModal">
      <ModalClaimConfirmation v-on:claim="claimEgg" />
    </ModalDialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useEggStore } from '@/stores/egg'
import { QrStream } from 'vue3-qr-reader'
import { useRouter } from 'vue-router'
import { useFileUploader } from '@/composables/useFileUploader'
import { useModal } from '../composables/useModal'

export default {
  components: {
    QrStream
  },
  setup (props, ctx) {
    const modal = useModal()
    const egg = useEggStore()
    const eggKey = ref(null)
    const decodedString = ref('')

    const router = useRouter()
    const fileUploader = useFileUploader()
    const previousRoute = ref('')

    function saveInfo () {
      egg.saveClaimInfo(fileUploader.fileInfo.value)
      router.push({
        name: 'egg',
        params: { id: fileUploader.fileInfo.value.key }
      })
    }

    function submitAndRedirect () {
      router.push({ name: 'egg', params: { id: eggKey.value } })
    }

    function onDecode (value) {
      if (value) {
        decodedString.value = value
        modal.showModal()
      }
    }

    function claimEgg () {
      const chunks = decodedString.value.split('/')
      const key = chunks[chunks.length - 1]
      if (key) {
        eggKey.value = key
        submitAndRedirect()
      }
    }

    return {
      egg,
      onFileSelected: fileUploader.onFileSelected,
      triggerSelectFile: fileUploader.triggerSelectFile,
      myFile: fileUploader.myFile,
      fileInfo: fileUploader.fileInfo,
      eggKey,
      saveInfo,
      submitAndRedirect,
      onDecode,
      previousRoute,
      claimEgg,
      modal
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
  display: grid;
  margin: 0 auto;
  grid-template-rows: repeat(4, max-content);
  row-gap: 24px;
  justify-items: center;
  align-content: center;
  text-align: center;
  .select-file-btn {
    max-width: 300px;
  }
  .qr-code {
    padding: 8px;
    border: 2px solid orange;
    border-style: dashed;
    width: 350px;
    height: 350px;
  }
}
</style>
