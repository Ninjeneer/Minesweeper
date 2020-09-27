<template>
  <header class="row">
    <div class="col-2">
      <h1>{{ pseudo }}</h1>
    </div>
    <div class="col-8 text-center">
      <h1>Jeu du démineur</h1>
    </div>
    <div class="col-2 text-right">
      <h1>>></h1>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    pseudo: String,
  },
};
</script>