import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { generateWCFIsland, Island } from "tguesdon-island-generator";
import { DataTexture } from "three";
const glsl = require("babel-plugin-glsl/macro");

const vertexShader = glsl`

    uniform sampler2D u_height;
    varying float v_height;
    varying float v_sea_level;
    varying vec3 v_position;
    uniform float u_time;

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        v_position = modelPosition.xyz;
        v_height = texture2D(u_height, uv).r * 1.0;
        v_sea_level = 0.17;

        if(v_height < v_sea_level){
            float var = (1.0 + sin(u_time * 0.5) / 2.0) * 0.02;
            modelPosition.z = v_sea_level;
            v_height += var;
        }else{
            modelPosition.z = v_height;
        }


       modelPosition.z /= 5.0;


        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
    
        gl_Position = projectedPosition;
    }
`;

const fragmentShader = glsl`
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

    varying float v_height;
    varying float v_sea_level;
    varying vec3 v_position;
    uniform float u_time;

    void main() {
        vec4 color;

        if(v_height < v_sea_level - 0.1){
            color = vec4(0.0, 0.0, 1.0, 1.0);
        }else if(v_height < v_sea_level - 0.01){
            color = vec4(0.0, 0.2, 1.0, 1.0);
        }else if(v_height < v_sea_level){
            color = vec4(0.5, 0.9, 0.9, 1.0);
        }
        else if(v_height < v_sea_level + 0.05){
            color = vec4(1.0, 1.0, 0.4, 1.0);
        }
        else{
            color = vec4(0.0, 0.8 - v_height / 3.0, 0.0, 1.0);
        }

        gl_FragColor = color;
    }
`;

const IslandPlane: React.FC<{ index: number }> = ({ index }) => {
    const islandWidth = 32;
    const islandHeight = 32;

    const island: Island = useMemo(
        () => generateWCFIsland(islandWidth, islandHeight, 0.3, [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], true),
        [islandWidth, islandHeight]
    );
    const dataHeight: Uint8Array = useMemo(() => {
        const size = islandWidth * islandHeight;
        const data = new Uint8Array(size * 4);

        for (let x = 0; x < islandWidth; x++) {
            for (let y = 0; y < islandHeight; y++) {
                const idx = (y * islandWidth + x) * 4;
                data[idx] = Math.floor(island.points[y][x].elevation * 255);
                data[idx + 1] = Math.floor(island.points[y][x].elevation * 255);
                data[idx + 2] = Math.floor(island.points[y][x].elevation * 255);
                data[idx + 3] = Math.floor(island.points[y][x].elevation * 255);
            }
        }

        return data;
    }, [island]);

    const uniforms = useMemo(
        () => ({
            u_time: {
                value: 0,
            },
            u_height: {
                value: new DataTexture(new Float32Array(), 0, 0),
            },
        }),
        []
    );

    useEffect(() => {
        const dataTex = new DataTexture(dataHeight, islandWidth, islandHeight);
        dataTex.needsUpdate = true;
        uniforms.u_height.value = dataTex;
    }, [dataHeight, uniforms.u_height]);

    useFrame((state, delta, xrFrame) => {
        uniforms.u_time.value = state.clock.getElapsedTime();
    });

    return (
        <mesh position={[((index % 8) * islandWidth) / 16, (Math.floor(index / 8) * islandHeight) / 16, 1]}>
            <planeGeometry args={[islandWidth / 16, islandHeight / 16, islandWidth, islandHeight]} />
            <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} wireframe={false} />
        </mesh>
    );
};

export const IslandScene: React.FC = () => {
    const tiles = 64;

    return (
        <Canvas camera={{ position: [0, 0, 1] }}>
            <OrbitControls></OrbitControls>
            {[...Array(tiles)].map((e, i) => (
                <IslandPlane key={i} index={i}></IslandPlane>
            ))}
        </Canvas>
    );
};
