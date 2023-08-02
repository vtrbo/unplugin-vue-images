<script lang="ts">
import Jpeg from '~images:svg/icons/jpeg.svg?width=80&height=60'

export default {
  name: 'App',
  components: {
    Jpeg,
  },
  methods: {
    handleClick() {
      console.log('on click')
    },
  },
}
</script>

<template>
  <div>
    <Jpeg />
    <png />
    <png-svg />
    <svg-png />
    <svg-png-svg width="100" />
    <icons-svg />
    <svg-icons-gif />
  </div>
</template>
