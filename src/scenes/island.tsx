import { OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react";
import { generate, Island, Point } from "tguesdon-island-generator"
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
        v_sea_level = 0.15;

        if(v_height < v_sea_level){
            float var = (1.0 + sin(u_time * 0.5) / 2.0) * 0.02;
            modelPosition.z = v_sea_level;
            v_height += var;
        }else{
            modelPosition.z = v_height;
        }


        modelPosition.z /= 10.0;


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

const IslandPlane:React.FC = () => {
    const islandPoints = 32;
    
    const island: Island = useMemo(() => generate(islandPoints, islandPoints), [islandPoints])
    const dataHeight: Uint8Array = useMemo(() => {
        const size = islandPoints * islandPoints;
        const data = new Uint8Array(size * 4);

        for(let x = 0; x < islandPoints; x++){
            for(let y = 0; y < islandPoints; y++){
                const idx = (x * islandPoints + y) * 4;
                data[idx] = Math.floor(island.points[x][y].elevation * 255);
                data[idx + 1] = Math.floor(island.points[x][y].elevation * 255);
                data[idx + 2] = Math.floor(island.points[x][y].elevation * 255);
                data[idx + 3] = Math.floor(island.points[x][y].elevation * 255);
            }
        }

        return data;
    }, [island])

    const uniforms = useMemo(
        () => ({
            u_time: {
                value: 0,
            },
            u_height: {
                value: new DataTexture(new Float32Array(), 0, 0)
            }
        }),
        []
    );

    useEffect(() => {
        const dataTex =  new DataTexture(dataHeight,islandPoints,islandPoints );
        dataTex.needsUpdate = true;
        uniforms.u_height.value = dataTex;
    }, [dataHeight, uniforms.u_height]);

    useFrame((state, delta, xrFrame) => {
        uniforms.u_time.value = state.clock.getElapsedTime();
    });

    return (
        <mesh>
            <planeGeometry args={[1,1,islandPoints,islandPoints]}/>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe={false}  
            />
        </mesh>
    )
}

export const IslandScene: React.FC = () => {
    return (
    <Canvas camera={{position: [0, 0, 1]}}>
        <OrbitControls></OrbitControls>
        <IslandPlane></IslandPlane>
    </Canvas>)
}