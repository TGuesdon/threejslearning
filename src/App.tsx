import React, { useEffect, useRef } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";

import "./App.css";
import styled from "styled-components";
import { Mesh } from "three";
import useWindowSize from "./hooks";

function Wrapper() {
  const ref = useRef<Mesh>(null!);
  const { width, height } = useWindowSize();

  const mouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const x = e.clientX / width;
    const y = e.clientY / height;

    ref.current.rotation.y = x * Math.PI;
    ref.current.rotation.x = y * Math.PI;
  };

  return (
    <Canvas onPointerMove={(e) => mouseMove(e)}>
      <mesh ref={ref}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color={"blue"} />
      </mesh>
    </Canvas>
  );
}

function App() {
  return (
    <Frame>
      <Wrapper></Wrapper>
    </Frame>
  );
}

export default App;

const Frame = styled.div`
  height: 100vh;
  width: 100%;
`;
