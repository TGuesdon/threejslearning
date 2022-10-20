import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Vector2 } from "three";
import useWindowSize from "../hooks";

const vertexShader = `
    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
    
        projectedPosition.y += sin(projectedPosition.x + u_time);
        gl_Position = projectedPosition;
    }
`;

const fragmentShader = `
    uniform float u_time;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const WavePlane: React.FC = () => {
  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0,
      },
      u_resolution: {
        value: new Vector2(0, 0),
      },
    }),
    []
  );

  useFrame((state, delta, xrFrame) => {
    uniforms.u_time.value = state.clock.getElapsedTime();
  });

  const { width, height } = useWindowSize();

  useEffect(() => {
    uniforms.u_resolution.value = new Vector2(width, height);
  }, [width, height, uniforms]);

  return (
    <mesh>
      <planeGeometry args={[1, 2, 16, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const WaveScene: React.FC = () => {
  const origin = { x: 0, y: 0, z: 0 };

  return (
    <Canvas camera={{ fov: 50 }}>
      <ambientLight color={"#f5be8c"} />
      <pointLight
        position={[origin.x + 10, origin.y + 10, origin.z + 10]}
        color={"#f52c9e"}
      />
      <WavePlane />
    </Canvas>
  );
};

export default WaveScene;
