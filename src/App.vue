<template>
  <div>
    <app-navbar v-sticky="{zIndex: 1000}"></app-navbar>
    <app-info id="info"></app-info>
    <app-transfer-learning id="transfer"></app-transfer-learning>
    <app-newmodel id="newModel"></app-newmodel>
    <!-- <router-view/> -->
    <app-footer></app-footer>
  </div>
</template>

<script>
import VueSticky from "vue-sticky";
import Navbar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
import Info from "./components/Info.vue";
import NewModel from "./components/NewModel.vue";
import Transfer from "./components/Transfer.vue";
// import Home from "./components/Main/Home.vue";

export default {
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer,
    "app-info": Info,
    "app-newmodel": NewModel,
    "app-transfer-learning": Transfer
    // "app-home": Home
  },
  directives: {
  'sticky': VueSticky,
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
