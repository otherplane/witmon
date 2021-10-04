<template>
  <p>{{ timeLeft }}</p>
</template>

<script>
import { intervalToDuration, formatDuration } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ref, watch } from 'vue'

const timeZone = 'Europe/Lisbon'

export default {
  props: {
    timestamp: Number,
    seconds: Boolean
  },
  beforeUnmount () {
    clearInterval(this.polling)
  },
  setup (props, { emit }) {
    const dateNow = ref(new Date())
    const polling = setInterval(() => {
      dateNow.value = new Date()
    }, 0)
    const timeLeft = ref(1)
    const formatWithSeconds = ['days', 'hours', 'minutes', 'seconds']
    const format = ['days', 'hours', 'minutes']
    const formatDistanceLocale = {
      xDays: '{{count}} d',
      xSeconds: '{{count}} s',
      xMinutes: '{{count}} m',
      xHours: '{{count}} h'
    }
    const shortEnLocale = {
      formatDistance: (token, count) =>
        formatDistanceLocale[token].replace('{{count}}', count)
    }

    watch(dateNow, () => {
      const duration = intervalToDuration({
        start: utcToZonedTime(dateNow.value, timeZone),
        end: utcToZonedTime(new Date(props.timestamp), timeZone)
      })
      timeLeft.value = formatDuration(duration, {
        format: props.seconds ? formatWithSeconds : format,
        locale: shortEnLocale
      })
      if (
        utcToZonedTime(new Date(props.timestamp), timeZone) <
        utcToZonedTime(dateNow.value, timeZone).getTime()
      ) {
        emit('clear-incubation')
        clearInterval(polling)
      }
    })
    return { timeLeft, dateNow, polling }
  }
}
</script>
