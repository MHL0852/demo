<template>
  <input v-model="data" class="cell_inner_input" type="text">
</template>

<script>
  export default {
    name: "input",
    props: {
      data: {
        type: 'String'
      }
    }
  }
</script>

<style scoped>
  .cell_inner_input {
    width: 100%;
    box-sizing: border-box;
  }
</style>
