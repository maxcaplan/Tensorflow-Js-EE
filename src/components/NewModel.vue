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

          <div class="row mb-3">
            <div class="col">
              <h3>Loss</h3>
              <canvas id="loss"></canvas>
            </div>
            <div class="col">
              <h3>Accuracy</h3>
              <canvas id="accuracy"></canvas>
            </div>
          </div>
          <hr>

          <div class="row d-flex justify-content-center mb-3">
            <h2>Predict</h2>
          </div>
          <div class="row d-flex align-items-center">

            <!-- drawing canvas -->
            <div class="col">
              <vue-p5 class="draw" @setup="setup" @mousedragged="mouseDragged" @mousereleased="mouseReleased" @keypressed="keyPressed"></vue-p5>
            </div>

            <div class="col-auto d-flex align-items-center"><i class="fas fa-angle-right fa-8x text-warning"></i></div>

            <!-- Graph of output array -->
            <div class="col d-flex justify-content-center align-items-center">
              <canvas id="predictionGraph"></canvas>
            </div>

            <div class="col-auto d-flex align-items-center"><i class="fas fa-angle-right fa-8x text-warning"></i></div>

            <!-- final prediction -->
            <div class="col d-flex text-center justify-content-center align-items-center">
              <div id="prediction">
                <h1 style="font-size:200px">{{ prediction }}</h1>
              </div>
            </div>

          </div>

          <div class="row">
            <div class="col">
              <i class="text-muted">press "C" to clear</i>
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
import VueP5 from "vue-p5";

export default {
  components: {
    "vue-p5": VueP5
  },
  data() {
    return {
      training: false,
      loss: null,
      accuracy: null,
      lChart: null,
      aChart: null,
      pChart: null,
      batchSize: 64,
      trainBatches: 100,
      bits: "",
      prediction: "",
      predictions: "",
      modelSum: null
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

    var colours = [];

    for (let i = 0; i < 10; i++) {
      colours.push(
        "rgb(" + 150 + "," + Math.round(Math.random() * 255) + "," + 255 + ")"
      );
    }

    var pCtx = document.getElementById("predictionGraph").getContext("2d");
    var pChart = new Chart(pCtx, {
      type: "doughnut",

      data: {
        datasets: [
          {
            data: [1],
            backgroundColor: colours
          }
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["prediction"]
      },

      options: {
        legend: {
          display: false
        }
      }
    });

    this.pChart = pChart;
    this.lChart = lChart;
    this.aChart = aChart;
  },

  watch: {
    bits: "predict",
    predictions: "predictionChartUpdate"
  },

  methods: {
    train(lChart, aChart) {
      this.training = true;

      const that = this;

      var loss;
      var accuracy;
      var summary;

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
        summary = returnedValues[2];
      }

      async function mnist() {
        await load();
        await train();
        that.loss = loss;
        that.accuracy = accuracy;
        that.modelSum = summary;
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
    },
    predict() {
      console.log("predict");
      let result = model.predict(this.bits);
      let largest = Math.max.apply(Math, result);

      let prediction = -1;
      let index = 0;

      while (prediction == -1 || index > 9) {
        if (result[index] >= largest) {
          prediction = index;
        } else {
          index++;
        }
      }

      this.predictions = Array.prototype.slice.call(result);
      this.prediction = prediction;
    },

    predictionChartUpdate() {
      this.pChart.destroy();

      var colours = [];
      var data = [];

      for (let i = 0; i < this.predictions.length; i++) {
        colours.push(
          "rgb(" + 150 + "," + Math.round(Math.random() * 255) + "," + 255 + ")"
        );
      }

      

      for (let i = 0; i < this.predictions.length; i++) {
        data.push(this.predictions[i] * 100);
      }

      console.log(data)

      var ctx = document.getElementById("predictionGraph").getContext("2d");
      var chart = new Chart(ctx, {
        type: "doughnut",

        data: {
          datasets: [
            {
              data: data,
              backgroundColor: colours
            }
          ],

          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        },

        options: {
          legend: {
            display: false
          }
        }
      });

      this.pChart = chart;
    },

    //p5js methods
    setup(sketch) {
      const size = 28 * 8;

      sketch.pixelDensity(1 / 8);
      sketch.createCanvas(size, size);
      sketch.background("black");
    },
    mouseDragged(sketch) {
      sketch.strokeWeight(20);
      sketch.stroke("white");
      sketch.line(sketch.pmouseX, sketch.pmouseY, sketch.mouseX, sketch.mouseY);
    },
    mouseReleased(sketch) {
      if (sketch.mouseY < 28 * 28 + 1 && sketch.mouseX < 28 * 28 + 1) {
        sketch.loadPixels();
        let bits = [];

        for (var i = 0; i < sketch.pixels.length; i += 4) {
          let r = sketch.pixels[i];
          let g = sketch.pixels[i + 1];
          let b = sketch.pixels[i + 2];

          let value = (r + g + b) / 3 / 255;

          bits.push(value);
        }

        this.cacheVector(bits);
      }
    },
    keyPressed(sketch) {
      if (sketch.keyCode == 67) {
        sketch.background("black");
      }
    },
    cacheVector(bits) {
      this.bits = bits;
    }
  }
};
</script>

<style scoped>
#draw {
  width: 224px;
  height: 224px;
  border: 1px solid lightgrey;
}

#prediction {
  width: 224px;
  height: 224px;
  border: 1px solid lightgray;
  border-radius: 4px;
  background-color: white;
}

/* #predictionGraph {
  max-width: 100%;
  max-height: 100%;
} */

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