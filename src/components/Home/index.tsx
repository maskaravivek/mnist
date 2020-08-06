import { Button, Row, Col, Typography } from 'antd';
import DrawArea from "@components/DrawArea";
import * as tf from '@tensorflow/tfjs';
import React from 'react';
import { Tensor, Rank } from '@tensorflow/tfjs';

const { Text } = Typography;

const predict = async () => {
  const model = await tf.loadLayersModel('/mnist-model.json');
  const example = preprocessImage(getImageFromCanvas());  // for example
  const prediction = model.predict(example);
  tensorToClassLabel(prediction)
};

const tensorToClassLabel = (prediction) => {
  console.log(prediction.toString())
  prediction.array().then(array => {
    let maxIdx = array[0].indexOf(Math.max(...array[0]));
    alert(maxIdx)
  });
}

const getImageFromCanvas = () => {
  const imgData = localStorage.getItem('image')
  console.log(imgData)
  const image = new Image();
  image.height = 400
  image.width = 400
  image.src = imgData
  return image;
}

const preprocessImage = (img: any) => {
  let tensor = tf.browser.fromPixels(img)
  tensor = tensor.slice([0, 0, 0], [tensor.shape[0], tensor.shape[1], 1])

  const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(resized.div(offset));
  const batched = normalized.expandDims(0)
  console.log(batched.toString())
  return batched
}

const Home: React.FC<{}> = ({

}) => {
  return (
    <Row>
      <Col>
        <Text strong>Draw a digit from 0-9</Text>

        <DrawArea />
        <br />
        <br />
        <Button onClick={() => {
          predict()
        }} type="primary">Predict</Button></Col>
    </Row>
  );
};

export default Home;