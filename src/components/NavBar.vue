<template>
  <!-- <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
    <a href="#" class="navbar-brand">Handwritten Character Recognition</a>
  </nav> -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Handwritten Character Recognition <i class="fas fa-robot"></i></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" v-scroll-to="'#info'">Info</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" v-scroll-to="'#transfer'">Transfer Learning</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" v-scroll-to="'#newModel'">Browser Model</a>
        </li>
      </ul>
    </div>
    
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-brand {
  font-size: 30px;
}
</style>
