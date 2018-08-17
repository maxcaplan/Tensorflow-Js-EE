<template>
  <div id="app">
    <app-navbar></app-navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from "./components/NavBar.vue";
// import Footer from "./components/Footer.vue";
// import Home from "./components/Main/Home.vue";

export default {
  components: {
    "app-navbar": Navbar
    // "app-footer": Footer,
    // "app-home": Home
  }
};
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
