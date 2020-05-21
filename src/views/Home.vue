<template lang="pug">
v-container.pa-0(fluid fill-height)
  network(
    :year="2019"
  )
</template>

<script>
import Network from '@/components/Network'

export default {
  name: 'Home',
  components: {
    Network
  }
}
</script>
