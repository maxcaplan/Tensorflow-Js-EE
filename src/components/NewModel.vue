<template>
    <div class="container">
        <div class="card bg-light my-3">
          <div class="card-body text-center my-5">
            <h1 class="card-title">Train</h1>
            <i class="card-text text-muted">UI for training the ANN will go here</i>
          </div>
        </div>
    </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import { MnistData } from "../../src/scripts/data.js";
import * as model from "../../src/scripts/model.js";
export default {
  data() {
    return {};
  },
  created() {
    let data;
    async function load() {
      data = new MnistData();
      await data.load();
    }

    async function train() {
      await model.train(data)
    }

    async function mnist() {
      await load();
      await train();
    }
    mnist();
  },
  methods: {}
};
</script>

<style scoped>
</style>