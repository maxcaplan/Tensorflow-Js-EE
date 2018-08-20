<template>
  <div>
    <app-navbar></app-navbar>
    <app-info></app-info>
    <app-predict></app-predict>
    <app-newmodel></app-newmodel>
    <!-- <router-view/> -->
    <app-footer></app-footer>
  </div>
</template>

<script>
import Navbar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
import Info from "./components/Info.vue";
import NewModel from "./components/NewModel.vue";
import Predict from "./components/DrawPredict.vue";
// import Home from "./components/Main/Home.vue";

export default {
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer,
    "app-info": Info,
    "app-newmodel": NewModel,
    "app-predict": Predict
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
