import { ChangeEvent } from "react";
import styled from "styled-components";
import SceneList from "../common/common";

interface OverlayProps {
  currentScene: SceneList;
  setCurrentScene: (currentScene: SceneList) => void;
}

const Overlay: React.FC<OverlayProps> = ({
  currentScene,
  setCurrentScene,
}: OverlayProps) => {
  const changeScene = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentScene(e.target.value as SceneList);
  };
  return (
    <Container>
      <select
        onChange={(e) => {
          changeScene(e);
        }}
        value={currentScene}
      >
        <option value={"ORBIT"}>Orbit</option>
        <option value={"NONE"}>None</option>
      </select>
    </Container>
  );
};

export default Overlay;

const Container = styled.div`
  background-color: rgba(75, 75, 75, 0.44);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;
