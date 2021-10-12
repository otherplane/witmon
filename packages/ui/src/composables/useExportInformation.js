import { ref } from 'vue'
import { createDownloadLink } from '../services/exportInformation'

export function useExportInformation () {
  const downloadLink = ref('')
  // wil store the reference found in the template
  const download = ref(null)

  downloadLink.value = createDownloadLink()

  function triggerDownload () {
    download.value.click()
  }

  return {
    triggerDownload,
    download,
    downloadLink
  }
}
