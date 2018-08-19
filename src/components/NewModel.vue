<template>
    <div class="container">
        <div class="card bg-light my-3">
          <div class="card-body my-5">
            <div class="row d-flex justify-content-center">
              <h1 class="card-title">Browser Model</h1>
            </div>
            <div class="row d-flex justify-content-center">
              <p class="text-muted"><i>An ANN model trained live in the browser</i></p>
            </div>
            <div class="row mb-3">
              <div class="col">
                <button class="btn btn-primary" :class="{active: training}" @click.prevent="train()">
                  Train
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <h3>Loss</h3>
                <canvas id="loss"></canvas>
              </div>
              <div class="col">
                <h3>Accuracy</h3>
                <canvas id="accuracy"></canvas>
              </div>
            </div>
            <!-- <h1 class="card-title">Train</h1>
            <i class="card-text text-muted">UI for training the ANN will go here</i> -->
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
    return {
      training: false,
      loss: null,
      accuracy: null
    };
  },
  mounted() {
    var lCtx = document.getElementById("loss").getContext("2d");
    var lChart = new Chart(lCtx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [],
        datasets: [
          {
            label: "Loss",
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: []
          }
        ]
      },

      // Configuration options go here
      options: {}
    });

    var aCtx = document.getElementById("accuracy").getContext("2d");
    var aChart = new Chart(aCtx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [],
        datasets: [
          {
            label: "Percent%",
            fill: false,
            backgroundColor: "rgb(56, 145, 166)",
            borderColor: "rgb(56, 145, 166)",
            data: []
          }
        ]
      },

      // Configuration options go here
      options: {}
    });
  },
  methods: {
    train() {
      this.training = true

      var loss
      var accuracy

      let data;
      async function load() {
        data = new MnistData();
        await data.load();
      }

      async function train() {
        var returnedValues = await model.train(data);
        loss = returnedValues[0]
        accuracy = returnedValues[1]
        console.log(loss)
      }

      const that = this
      async function mnist() {
        await load();
        await train();
        that.loss = loss
        that.accuracy = accuracy
        that.training = false
      }
      mnist();
    }
  }
};
</script>

<style scoped>
</style>