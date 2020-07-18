import { Button, Row, Typography } from 'antd';
import CanvasDraw from "react-canvas-draw";
import * as tf from '@tensorflow/tfjs';
import React from 'react';

const { Text } = Typography;

const predict = async (saveableCanvas: any) => {
  const model = await tf.loadLayersModel('/mnist-model.json');
  const example = preprocessImage(getImageFromCanvas(saveableCanvas));  // for example
  const prediction = model.predict(example);
  // tslint:disable-next-line:no-console
  console.log(prediction.toString())
};

const getImageFromCanvas = (saveableCanvas: any) => {
  const image = new Image();
  image.height = 28
  image.width = 28
  image.src = saveableCanvas.canvasContainer.children[1].toDataURL()
  return image;
}

const preprocessImage = (img: any) => {
  let tensor = tf.browser.fromPixels(img)
  tensor = tensor.slice([0, 0, 0], [tensor.shape[0], tensor.shape[1], 1])

  const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(resized.div(offset));
  const batched = normalized.expandDims(0)
  return batched
}

const Home: React.FC<{}> = ({

}) => {
  const [saveableCanvas, setSaveableCanvas] = React.useState<any>("");
  return (
    <Row>
      <Text strong>Draw a digit from 0-9</Text>

      <CanvasDraw  hideGrid={true} ref={canvasDraw => (setSaveableCanvas(canvasDraw))} />
      <br />
      <br />
      <Button onClick={() => {
        predict(saveableCanvas)
      }} type="primary">Predict</Button>
    </Row>
  );
};

export default Home;