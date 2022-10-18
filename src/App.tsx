import "./App.css";
import styled from "styled-components";
import OrbitScene from "./scenes/orbit";
import { ReactNode, useState } from "react";
import SceneList from "./common/common";
import Overlay from "./overlay/overlay";

function App() {
  const [currentScene, setCurrentScene] = useState<SceneList>("NONE");

  const renderScene = (scene: SceneList) => {
    switch (scene) {
      case "ORBIT":
        return <OrbitScene></OrbitScene>;
      default:
        return (
          <NoScene>
            <p>Choisissez une scène</p>
          </NoScene>
        );
    }
  };

  return (
    <Frame>
      <OverlayWrapper>
        <Overlay
          currentScene={currentScene}
          setCurrentScene={setCurrentScene}
        />
      </OverlayWrapper>
      {renderScene(currentScene)}
    </Frame>
  );
}

export default App;

const Frame = styled.div`
  height: 100vh;
  width: 100%;
`;

const NoScene = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlayWrapper = styled.div`
  position: absolute;
  z-index: 999;
`;
