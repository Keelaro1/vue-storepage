<template>
  <div class="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/App/Navbar";

export default {
  name: 'App',
  components: {
    Navbar
  },
};
</script>

<style>
  @import "assets/index.css";
</style>
