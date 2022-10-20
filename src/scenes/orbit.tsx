import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";
import useWindowSize from "../hooks";

const Orbit: React.FC<{
  center: { x: number; y: number; z: number };
}> = ({ center }) => {
  const sphereRef = useRef<Mesh>(null!);

  useFrame((state, delta, xrFrame) => {
    const x = Math.cos(state.clock.getElapsedTime());
    const z = Math.sin(state.clock.getElapsedTime());
    sphereRef.current.position.x = center.x + x * 2;
    sphereRef.current.position.z = center.z + z * 2;
    sphereRef.current.position.y = center.y;
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[0.3]} />
      <meshLambertMaterial />
    </mesh>
  );
};

const OrbitScene: React.FC = () => {
  const ref = useRef<Mesh>(null!);
  const { width, height } = useWindowSize();
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });

  const rotate = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const x = e.clientX / width;
    const y = e.clientY / height;

    ref.current.rotation.y = x * Math.PI;
    ref.current.rotation.z = y * Math.PI;
  };

  const move = () => {
    setPos({ x: pos.x, y: pos.y, z: pos.z - 1 });
  };

  const origin = { x: 0, y: 0, z: 0 };

  return (
    <Canvas onPointerMove={(e) => rotate(e)} onClick={(e) => move()}>
      <ambientLight color={"#f5be8c"} />
      <pointLight
        position={[origin.x + 10, origin.y + 10, origin.z + 10]}
        color={"#f52c9e"}
      />
      <mesh ref={ref} position={[pos.x, pos.y, pos.z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial />
      </mesh>
      <Orbit center={pos}></Orbit>
    </Canvas>
  );
};

export default OrbitScene;
