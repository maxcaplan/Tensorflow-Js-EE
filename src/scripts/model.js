import * as tf from '@tensorflow/tfjs';
import {
  MnistData
} from "../../src/scripts/data.js";

const model = tf.sequential();

//1st layer: 2d convolutional
model.add(
  tf.layers.conv2d({
    inputShape: [28, 28, 1], //28x28 image with 1 colour channel
    kernelSize: 5, //5x5 filter window
    filters: 8, //number of filter windows of kernalSize
    strides: 1, //step size of sliding window
    activation: "relu", //rectified linear unit
    kernelInitializer: "VarianceScaling" //random initallizing weights
  })
);

//2nd layer: max pooling layer
//downsamples the result from the 1st layer
model.add(
  tf.layers.maxPooling2d({
    poolSize: [2, 2], //2x2 pooling window
    strides: [2, 2] //moves 2 pixels horizontal and 2 pixels vertical
  })
);

//3rd layer: second convolutinal layer
model.add(
  tf.layers.conv2d({
    //note input shape inferred from previous layer
    kernelSize: 5,
    filters: 16, //double the amount of filters
    strides: 1,
    activation: "relu",
    kernelInitializer: "VarianceScaling"
  })
);

//4th layer: second pooling layer
model.add(
  tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
  })
);

//5th layer: flattens output from previous layer to vector
model.add(tf.layers.flatten());

//6th layer: dense output layer
model.add(
  tf.layers.dense({
    units: 10, //10 outpu nodes for 0-9
    kernelInitializer: "VarianceScaling",
    activation: "softmax" //normalizes vector into probability distrobution
  })
);

//training the model

const LEARNING_RATE = 0.15
const optimizer = tf.train.sgd(LEARNING_RATE); //stochastic gradient descent optimizer

model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
})

const BATCH_SIZE = 64;
const TRAIN_BATCHES = 100;

const TEST_BATCH_SIZE = 1000;
const TEST_ITERATION_FREQUENCY = 5;

//training loop:
export async function train(data) {
  for (let i = 0; i < TRAIN_BATCHES; i++) {
    //data broken into batches for gpu parallelization and averaging
    const batch = data.nextTrainBatch(BATCH_SIZE)

    let testBatch;
    let validationData

    //check accuracy based on test images every 5 steps
    if (i % TEST_ITERATION_FREQUENCY === 0) {
      testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
      validationData = [
        testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
      ];
    }

    const history = await model.fit(
      batch.xs.reshape([BATCH_SIZE, 28, 28, 1]), //reshapes data from vector to 2d tensor
      batch.labels, { //labels batch
        batchSize: BATCH_SIZE,
        validationData,
        epochs: 1 //how many times the batch is run through the ANN
      });

    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];

    console.log("loss: " + loss + ", accuracy: " + accuracy)
  }
}
