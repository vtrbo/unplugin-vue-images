<script lang="ts" setup>
import Account from '~images/account.png'
import AccountS from '~images/account.svg'
import Password from '~images:normal/password.png'
import OA from '~images:others/account.png'
import TestAccount from '~images/test/account?png'
import TestPassword from '~images/test/password.png?width=100'
import Test2Account from '~images/test/test/account?png&height=100'
import Test2Password from '~images/test/test/password.png?gif&width=100&height=100'
</script>

<template>
  <div>
    <Account width="150" @click="() => console.log('on click')" />
    <AccountS />
    <OA />
    <Password />
    <TestAccount />
    <TestPassword />
    <Test2Account />
    <Test2Password />
  </div>
</template>

<style scoped>

</style>
