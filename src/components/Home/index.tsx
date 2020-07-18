import { Button, Row, Typography } from 'antd';
import react from "react";
import CanvasDraw from "react-canvas-draw";

const { Text, Title } = Typography;

const Home: React.FC<{}> = ({

}) => {
  const [saveableCanvas, setSaveableCanvas] = React.useState<any>("");
  return (
    <Row>
      <Text strong>Draw a digit from 0-9</Text>

      <CanvasDraw hideGrid={true} ref={canvasDraw => (setSaveableCanvas(canvasDraw))} />
      <br />
      <br />
      <Button onClick={() => {
        localStorage.setItem(
          "savedDrawing",
          saveableCanvas.canvasContainer.children[1].toDataURL()
        );
      }} type="primary">Predict</Button>
    </Row>
  );
};

export default Home;