<template>
  <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10"
      >
        <!-- Heroicon name: outline/exclamation -->
        <Egg class="egg-image" :index="egg.index" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3
          class="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Open your egg and preview your WittyCreature
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-900">
            Opening an egg does not mean you got the NFT, once open, click 'Mint
            egg' to mint your WittyCreature.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="mintEgg"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Open
    </button>
    <button
      @click="$parent.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Cancel
    </button>
    <a
      ref="download"
      :href="downloadLink"
      name="information.json"
      download="information.json"
      style="display: none"
    />
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useWeb3Witmon } from '../composables/useWeb3Witmon'
import { useEggStore } from '@/stores/egg'

export default defineComponent({
  setup (props, ctx) {
    const instance = getCurrentInstance()
    const w3Witmon = useWeb3Witmon()
    const egg = useEggStore()

    return {
      egg,
      mintEgg () {
        w3Witmon.openEgg()
        instance.parent.emit('close')
      }
    }
  }
})
</script>
