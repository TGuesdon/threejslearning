import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Vector2 } from "three";
import useWindowSize from "../hooks";
const glsl = require("babel-plugin-glsl/macro");

const vertexShader = glsl`
  #define PI 3.1415926538
  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

  uniform float u_time;
  uniform vec2 u_resolution;

  varying vec4 v_position;
  varying vec4 v_wave_position;

  void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      v_position = modelPosition;
      modelPosition.y += 1.0 + sin(modelPosition.x * PI / 2.0 + u_time) / 2.0;
      modelPosition.y += snoise3(modelPosition.xyz) * 0.1;
      v_wave_position = modelPosition;
    

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
  
      gl_Position = projectedPosition;
  }
`;

const fragmentShader = glsl`
  uniform float u_time;
  varying vec4 v_position;
  varying vec4 v_wave_position;

  void main() {
    float opacity = 1.0 - v_position.y / 2.0;
    float green = v_position.y > 0.4 ? 0.2 : 0.0;

    gl_FragColor = vec4(0.0, green, 1.0, opacity);
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
    <>
      <OrbitControls></OrbitControls>
      <mesh>
        <boxGeometry args={[6, 1, 5, 64, 32, 32]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>
    </>
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
