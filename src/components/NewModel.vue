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

            <form class="needs-validation" @submit.prevent="train(lChart, aChart)" v-if="!training">
              <div class="form-row">
                <div class="col mb-3">
                  <label for="batchSize">Batch Size</label>
                  <input type="text" class="form-control" id="batchSize" v-model="batchSize" required>
                </div>
                <div class="col mb-3">
                  <label for="trainingBatches">Training Batches</label>
                  <input type="text" class="form-control" id="trainingBatches" v-model="trainBatches" required>
                </div>
                <div class="col-auto mb-3 d-flex align-items-end">
                  <button class="btn btn-primary" type="submit">Train</button>
                </div>
              </div>
            </form>

            <div class="spinner my-3" v-if="training">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
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
      accuracy: null,
      lChart: null,
      aChart: null,
      batchSize: 64,
      trainBatches: 100
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
      options: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "epoch"
              },
              ticks: {
                autoSkip: true,
                autoSkipPadding: 10
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "loss"
              }
            }
          ]
        }
      }
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
            label: "Accuracy",
            fill: false,
            backgroundColor: "rgb(56, 145, 166)",
            borderColor: "rgb(56, 145, 166)",
            data: []
          }
        ]
      },

      // Configuration options go here
      options: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "epoch"
              },
              ticks: {
                autoSkip: true,
                autoSkipPadding: 10
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "percentage"
              }
            }
          ]
        }
      }
    });

    this.lChart = lChart;
    this.aChart = aChart;
  },
  methods: {
    train(lChart, aChart) {
      this.training = true;

      const that = this;

      var loss;
      var accuracy;

      let data;
      async function load() {
        data = new MnistData();
        await data.load();
      }

      async function train() {
        var returnedValues = await model.train(
          data,
          that.batchSize,
          that.trainBatches
        );
        loss = returnedValues[0];
        accuracy = returnedValues[1];
      }

      async function mnist() {
        await load();
        await train();
        that.loss = loss;
        that.accuracy = accuracy;
        that.training = false;

        //update charts
        for (let i = 0; i < loss.length; i++) {
          lChart.data.labels.push(loss[i].batch);

          lChart.data.datasets.forEach(dataset => {
            dataset.data.push(loss[i].loss);
          });
          lChart.update();
        }

        for (let j = 0; j < accuracy.length; j++) {
          aChart.data.labels.push(accuracy[j].batch);

          aChart.data.datasets.forEach(dataset => {
            dataset.data.push(accuracy[j].accuracy * 100);
          });
          aChart.update();
        }
      }
      mnist();
    }
  }
};
</script>

<style scoped>
.spinner {
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #333;
  height: 100%;
  width: 6px;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>